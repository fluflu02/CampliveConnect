import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AvailabilityDisplay } from "@/components/AvailabilityDisplay";
import { ReportTimeline } from "@/components/ReportTimeline";
import { StatusReportModal } from "@/components/StatusReportModal";
import { MapPin, Heart, Share2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useParams } from "wouter";
import type { Campground } from "@shared/schema";
import lakesideImage from "@assets/generated_images/Lakeside_campground_landscape_a490e214.png";
import { formatDistanceToNow } from "date-fns";

type CampgroundWithAvailability = Campground & {
  motorhomeAvailability?: number | null;
  caravanAvailability?: number | null;
  vwBusAvailability?: number | null;
  largeTentAvailability?: number | null;
  smallTentAvailability?: number | null;
};

interface ReportWithUser {
  id: string;
  motorhomeAvailability?: number | null;
  caravanAvailability?: number | null;
  vwBusAvailability?: number | null;
  largeTentAvailability?: number | null;
  smallTentAvailability?: number | null;
  createdAt: string;
  userId: string;
  user?: {
    name: string;
  };
}

export default function CampgroundDetail() {
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const { token, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: campground, isLoading: loadingCampground } = useQuery<CampgroundWithAvailability>({
    queryKey: ["/api/campgrounds", id],
    enabled: !!id,
  });

  const { data: reports, isLoading: loadingReports } = useQuery<ReportWithUser[]>({
    queryKey: ["/api/campgrounds", id, "reports"],
    enabled: !!id,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Not authenticated");
      if (isFollowing) {
        return apiRequest("DELETE", `/api/follow/${id}`, undefined);
      } else {
        return apiRequest("POST", "/api/follow", { campgroundId: id });
      }
    },
    onSuccess: () => {
      setIsFollowing(!isFollowing);
      queryClient.invalidateQueries({ queryKey: ["/api/follows"] });
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: `You have ${isFollowing ? "unfollowed" : "started following"} this campground`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update follow status",
        variant: "destructive",
      });
    },
  });

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow campgrounds",
        variant: "destructive",
      });
      return;
    }
    followMutation.mutate();
  };

  const handleReportSubmit = () => {
    toast({
      title: "Status reported",
      description: "Thank you for your report!",
    });
  };

  if (loadingCampground) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-80 w-full" />
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!campground) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Campground not found</p>
      </div>
    );
  }

  const formattedReports = reports?.map((report) => ({
    id: report.id,
    userName: report.user?.name || "Anonymous",
    userInitials: (report.user?.name || "A").substring(0, 2).toUpperCase(),
    motorhomeAvailability: report.motorhomeAvailability,
    caravanAvailability: report.caravanAvailability,
    vwBusAvailability: report.vwBusAvailability,
    largeTentAvailability: report.largeTentAvailability,
    smallTentAvailability: report.smallTentAvailability,
    verified: false,
    timestamp: formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }),
  })) || [];

  return (
    <div className="min-h-screen">
      <div className="relative h-80">
        <img
          src={campground.imageUrl || lakesideImage}
          alt={campground.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
            onClick={handleFollowToggle}
            disabled={followMutation.isPending}
            data-testid="button-follow-detail"
          >
            <Heart className={`h-5 w-5 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
            data-testid="button-share"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">{campground.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{campground.region}</span>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Current Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityDisplay
                motorhomeAvailability={campground.motorhomeAvailability}
                caravanAvailability={campground.caravanAvailability}
                vwBusAvailability={campground.vwBusAvailability}
                largeTentAvailability={campground.largeTentAvailability}
                smallTentAvailability={campground.smallTentAvailability}
              />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Campground</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {campground.description || "No description available."}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {campground.capacity && (
                    <div>
                      <span className="font-medium">Capacity:</span> {campground.capacity} sites
                    </div>
                  )}
                  {campground.amenities && campground.amenities.length > 0 && (
                    <div>
                      <span className="font-medium">Amenities:</span> {campground.amenities.join(", ")}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Location:</span> {campground.lat.toFixed(4)}, {campground.lng.toFixed(4)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports (Last 12h)</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingReports ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : formattedReports.length > 0 ? (
                  <ReportTimeline reports={formattedReports} />
                ) : (
                  <p className="text-muted-foreground text-center py-4">No reports yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1"
            onClick={() => setReportModalOpen(true)}
            data-testid="button-report-status-detail"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Report Status
          </Button>
        </div>
      </div>

      <StatusReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        campgroundName={campground.name}
        campgroundId={campground.id}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
