import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

interface LocationMapProps {
  lat: number;
  lng: number;
  name: string;
}

export function LocationMap({ lat, lng, name }: LocationMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-80 rounded-lg overflow-hidden border bg-muted/20 flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Google Maps API key not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border" data-testid="location-map">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="spotfree-map"
          defaultCenter={{ lat, lng }}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          <AdvancedMarker position={{ lat, lng }}>
            <div className="bg-teal-500 border-2 border-teal-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
