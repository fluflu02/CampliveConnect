import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Megaphone, TrendingUp, CheckCircle2 } from "lucide-react";
import { ForecastManager } from "@/components/ForecastManager";
import { AnnouncementCreator } from "@/components/AnnouncementCreator";
import { useState } from "react";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [selectedCampground, setSelectedCampground] = useState<string | null>(null);

  const { data: campgrounds, isLoading } = useQuery<any[]>({
    queryKey: ["/api/owner/campgrounds"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!campgrounds || campgrounds.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Owner Dashboard</h1>
          <p className="text-muted-foreground">
            You don't have any verified campgrounds yet. Claim a campground to get started!
          </p>
          <Button onClick={() => window.location.href = "/campgrounds"} data-testid="button-browse-campgrounds">
            Browse Campgrounds
          </Button>
        </div>
      </div>
    );
  }

  const selected = campgrounds.find((c) => c.id === selectedCampground) || campgrounds[0];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-dashboard-title">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your campgrounds</p>
        </div>
        {user?.name && (
          <Badge variant="secondary" className="text-base" data-testid="badge-owner-name">
            {user.name}
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campgrounds.map((campground) => (
          <Card 
            key={campground.id} 
            className={`cursor-pointer transition-all hover-elevate ${
              selected.id === campground.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedCampground(campground.id)}
            data-testid={`card-campground-${campground.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl" data-testid={`text-campground-name-${campground.id}`}>
                  {campground.name}
                </CardTitle>
                {campground.isVerifiedOwner && (
                  <Badge variant="default" className="gap-1" data-testid={`badge-verified-${campground.id}`}>
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <CardDescription data-testid={`text-campground-region-${campground.id}`}>
                {campground.region}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span data-testid={`text-follower-count-${campground.id}`}>
                  {campground.followerCount} {campground.followerCount === 1 ? 'follower' : 'followers'}
                </span>
              </div>
              {campground.capacity && (
                <div className="text-sm text-muted-foreground" data-testid={`text-capacity-${campground.id}`}>
                  Capacity: {campground.capacity}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl" data-testid="text-selected-campground-name">
            {selected.name}
          </CardTitle>
          <CardDescription data-testid="text-selected-campground-description">
            Manage forecasts and announcements for this campground
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="forecasts" className="w-full">
            <TabsList className="grid w-full grid-cols-2" data-testid="tabs-management">
              <TabsTrigger value="forecasts" className="gap-2" data-testid="tab-forecasts">
                <Calendar className="h-4 w-4" />
                Forecasts
              </TabsTrigger>
              <TabsTrigger value="announcements" className="gap-2" data-testid="tab-announcements">
                <Megaphone className="h-4 w-4" />
                Announcements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forecasts" className="space-y-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <TrendingUp className="h-4 w-4" />
                <span>Set expected availability for the next 7 days</span>
              </div>
              <ForecastManager campgroundId={selected.id} />
            </TabsContent>

            <TabsContent value="announcements" className="space-y-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Megaphone className="h-4 w-4" />
                <span>Share updates with {selected.followerCount} {selected.followerCount === 1 ? 'follower' : 'followers'}</span>
              </div>
              <AnnouncementCreator campgroundId={selected.id} followerCount={selected.followerCount} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
