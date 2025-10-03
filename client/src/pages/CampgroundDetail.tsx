import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { ReportTimeline } from "@/components/ReportTimeline";
import { StatusReportModal } from "@/components/StatusReportModal";
import { MapPin, Heart, Share2, MessageSquare } from "lucide-react";
import { useState } from "react";
import lakesideImage from "@assets/generated_images/Lakeside_campground_landscape_a490e214.png";

export default function CampgroundDetail() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const reports = [
    {
      id: "1",
      userName: "Sarah Chen",
      userInitials: "SC",
      status: "available" as const,
      verified: true,
      timestamp: "2h ago",
    },
    {
      id: "2",
      userName: "Mike Johnson",
      userInitials: "MJ",
      status: "full" as const,
      timestamp: "5h ago",
    },
    {
      id: "3",
      userName: "Emily Davis",
      userInitials: "ED",
      status: "available" as const,
      timestamp: "8h ago",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative h-80">
        <img
          src={lakesideImage}
          alt="Pine Lake Campground"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
            onClick={() => {
              setIsFollowing(!isFollowing);
              console.log(isFollowing ? "Unfollowed" : "Followed");
            }}
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
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Pine Lake Campground</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Yosemite National Park, CA</span>
            </div>
          </div>
          <StatusBadge status="available" verified={true} />
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
                  Beautiful lakeside camping with stunning mountain views. Perfect for families and RVs. 
                  Features include electric hookups, water access, and nearby hiking trails.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Capacity:</span> 50 sites
                  </div>
                  <div>
                    <span className="font-medium">Amenities:</span> Restrooms, Showers
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> RV & Tent
                  </div>
                  <div>
                    <span className="font-medium">Elevation:</span> 4,500 ft
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
                <ReportTimeline reports={reports} />
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
        campgroundName="Pine Lake Campground"
        onSubmit={(status) => console.log("Reported:", status)}
      />
    </div>
  );
}
