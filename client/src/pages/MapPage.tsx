import { MapView } from "@/components/MapView";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Campground } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function MapPage() {
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
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      <MapView campgrounds={campgrounds || []} onMarkerClick={handleMarkerClick} />
    </div>
  );
}
