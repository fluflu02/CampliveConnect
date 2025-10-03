import { CampgroundCard } from "@/components/CampgroundCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { StatusReportModal } from "@/components/StatusReportModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { Campground } from "@shared/schema";
import lakesideImage from "@assets/generated_images/Lakeside_campground_landscape_a490e214.png";
import mountainImage from "@assets/generated_images/Mountain_campground_scenic_view_5d210fdd.png";

const defaultImages = [lakesideImage, mountainImage];

type CampgroundWithAvailability = Campground & {
  motorhomeAvailability?: number | null;
  caravanAvailability?: number | null;
  vwBusAvailability?: number | null;
  largeTentAvailability?: number | null;
  smallTentAvailability?: number | null;
};

export default function CampgroundList() {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();
  const { toast } = useToast();

  const { data: campgrounds, isLoading } = useQuery<CampgroundWithAvailability[]>({
    queryKey: ["/api/campgrounds", searchQuery ? { search: searchQuery } : null].filter(Boolean),
    enabled: true,
  });

  const { data: follows = [] } = useQuery<string[]>({
    queryKey: ["/api/follows"],
    enabled: !!token,
  });

  const handleReportSubmit = () => {
    toast({
      title: "Status reported",
      description: "Availability updated successfully",
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search campgrounds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-campgrounds"
            />
          </div>
          <Button variant="outline" size="icon" data-testid="button-filters">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : campgrounds && campgrounds.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campgrounds.map((campground, idx) => (
              <CampgroundCard
                key={campground.id}
                id={campground.id}
                name={campground.name}
                location={campground.region}
                image={campground.imageUrl || defaultImages[idx % defaultImages.length]}
                motorhomeAvailability={campground.motorhomeAvailability}
                caravanAvailability={campground.caravanAvailability}
                vwBusAvailability={campground.vwBusAvailability}
                largeTentAvailability={campground.largeTentAvailability}
                smallTentAvailability={campground.smallTentAvailability}
                lastUpdated="Recently"
                reportCount={0}
                isFollowing={follows.includes(campground.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No campgrounds found</p>
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 rounded-full shadow-xl"
        onClick={() => setReportModalOpen(true)}
        data-testid="button-quick-report"
      >
        <Plus className="h-5 w-5 mr-2" />
        Report Status
      </Button>

      <StatusReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        campgroundName="Selected Campground"
        campgroundId={campgrounds?.[0]?.id}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
