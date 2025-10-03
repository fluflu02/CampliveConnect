import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Locate, Filter } from "lucide-react";
import { useState } from "react";

export function MapView() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative h-full w-full bg-muted/20">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Map view (Mapbox/Leaflet integration)</p>
        </div>
      </div>

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
    </div>
  );
}
