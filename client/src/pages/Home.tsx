import { MapView } from "@/components/MapView";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Campground } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: campgrounds, isLoading } = useQuery<Campground[]>({
    queryKey: ["/api/campgrounds"],
  });

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
      
      <div className="absolute bottom-4 left-4 z-10 max-w-md">
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
    </div>
  );
}
