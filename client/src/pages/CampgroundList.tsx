import { CampgroundCard } from "@/components/CampgroundCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { StatusReportModal } from "@/components/StatusReportModal";
import { useState } from "react";
import lakesideImage from "@assets/generated_images/Lakeside_campground_landscape_a490e214.png";
import mountainImage from "@assets/generated_images/Mountain_campground_scenic_view_5d210fdd.png";

export default function CampgroundList() {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const campgrounds = [
    {
      id: "1",
      name: "Pine Lake Campground",
      location: "Yosemite, CA",
      image: lakesideImage,
      status: "available" as const,
      verified: true,
      lastUpdated: "2h ago",
      reportCount: 5,
    },
    {
      id: "2",
      name: "Mountain View RV Park",
      location: "Rocky Mountains, CO",
      image: mountainImage,
      status: "full" as const,
      verified: false,
      lastUpdated: "4h ago",
      reportCount: 12,
    },
    {
      id: "3",
      name: "Riverside Camping",
      location: "Yellowstone, WY",
      image: lakesideImage,
      status: "unknown" as const,
      verified: false,
      lastUpdated: "10h ago",
      reportCount: 3,
    },
  ];

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campgrounds.map((campground) => (
            <CampgroundCard key={campground.id} {...campground} />
          ))}
        </div>
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
        onSubmit={(status) => console.log("Reported:", status)}
      />
    </div>
  );
}
