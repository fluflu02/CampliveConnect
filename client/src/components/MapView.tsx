import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Locate, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Campground } from "@shared/schema";
import { AddCampgroundModal } from "./AddCampgroundModal";

interface MapViewProps {
  campgrounds?: Campground[];
  onMarkerClick?: (campground: Campground) => void;
}

const ENGADIN_CENTER = { lat: 46.6, lng: 9.9 };

export function MapView({ campgrounds = [], onMarkerClick }: MapViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="relative h-full w-full bg-muted/20 flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Google Maps API key not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full text-[15px]">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="spotfree-map"
          defaultCenter={ENGADIN_CENTER}
          defaultZoom={11}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {campgrounds.map((campground) => {
            if (!campground.lat || !campground.lng) return null;

            return (
              <AdvancedMarker
                key={campground.id}
                position={{ lat: campground.lat, lng: campground.lng }}
                onClick={() => onMarkerClick?.(campground)}
              >
                <div className="bg-teal-500 border-2 border-teal-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform text-[15px]">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10">
        <Card className="bg-background/95 backdrop-blur-md border-border/50">
          <div className="flex gap-2 p-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search campgrounds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-map"
              />
            </div>
            <Button size="icon" variant="outline" data-testid="button-filter">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      <Button
        size="icon"
        className="absolute bottom-20 right-4 h-12 w-12 rounded-full shadow-lg"
        data-testid="button-locate"
      >
        <Locate className="h-5 w-5" />
      </Button>

      <Button
        size="icon"
        className="absolute bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setShowAddModal(true)}
        data-testid="button-add-campground"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <AddCampgroundModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
