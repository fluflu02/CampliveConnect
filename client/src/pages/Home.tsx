import { MapView } from "@/components/MapView";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Campground } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Info, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const { data: campgrounds, isLoading } = useQuery<Campground[]>({
    queryKey: ["/api/campgrounds"],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = (campground: Campground) => {
    setLocation(`/campground/${campground.id}`);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      <MapView campgrounds={campgrounds || []} onMarkerClick={handleMarkerClick} />
      
      {showWelcome && (
        <div className="absolute bottom-4 left-4 z-10 max-w-md transition-opacity duration-500" data-testid="welcome-message">
          <Card className="bg-background/95 backdrop-blur-md border-border/50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-1">Welcome to SpotFree</p>
                  <p className="text-muted-foreground">
                    Find available camping spots in the Engadin region. View real-time availability for motorhomes, caravans, VW buses, and tents. Click any marker on the map to see details and current availability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Button
        size="icon"
        className="absolute bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-10"
        onClick={() => setShowInfoDialog(true)}
        data-testid="button-info"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What is SpotFree?</DialogTitle>
            <DialogDescription className="space-y-3 pt-4">
              <p>
                SpotFree is a real-time campground availability tracker for the Engadin region in Switzerland. Our platform helps campers find available spots through community reporting and owner verification.
              </p>
              <p>
                <strong>How it works:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>View campgrounds on an interactive map</li>
                <li>See real-time availability for motorhomes, caravans, VW buses, and tents</li>
                <li>Report campground status to help fellow campers</li>
                <li>Follow your favorite campgrounds for updates</li>
                <li>Marker colors indicate availability: red (full), orange (partial), teal (available/unknown)</li>
              </ul>
              <p>
                Join our community of campers and never miss out on your perfect camping spot!
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
