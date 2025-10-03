import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCampgroundSchema, type InsertCampground } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState } from "react";

interface AddCampgroundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCampgroundModal({ open, onOpenChange }: AddCampgroundModalProps) {
  const { toast } = useToast();
  const [locationMethod, setLocationMethod] = useState<"coordinates" | "map" | "address">("map");
  const [mapCenter, setMapCenter] = useState({ lat: 46.6, lng: 9.9 });
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [addressInput, setAddressInput] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  const form = useForm<InsertCampground>({
    resolver: zodResolver(insertCampgroundSchema),
    defaultValues: {
      name: "",
      lat: 46.6,
      lng: 9.9,
      region: "Engadin",
      description: "",
      website: "",
      capacity: undefined,
      amenities: [],
      imageUrl: "",
      ownerUserId: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCampground) => {
      return await apiRequest("POST", "/api/campgrounds", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campgrounds"] });
      toast({
        title: "Success",
        description: "Campground added successfully",
      });
      form.reset();
      setSelectedPosition(null);
      setAddressInput("");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add campground",
        variant: "destructive",
      });
    },
  });

  const handleMapClick = (event: any) => {
    const latLng = event.latLng || event.detail?.latLng;
    if (latLng) {
      const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
      const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
      setSelectedPosition({ lat, lng });
      form.setValue("lat", lat);
      form.setValue("lng", lng);
    }
  };

  const geocodeAddress = async () => {
    if (!addressInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an address",
        variant: "destructive",
      });
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressInput)}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const lat = location.lat;
        const lng = location.lng;
        
        setSelectedPosition({ lat, lng });
        setMapCenter({ lat, lng });
        form.setValue("lat", lat);
        form.setValue("lng", lng);
        
        toast({
          title: "Location found",
          description: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
      } else {
        toast({
          title: "Address not found",
          description: "Please try a different address or use the map",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Geocoding error",
        description: "Failed to find address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const onSubmit = (data: InsertCampground) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Campground</DialogTitle>
          <DialogDescription>
            Register a new camping location in the Engadin region
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Campground Name *</Label>
            <Input
              id="name"
              data-testid="input-campground-name"
              {...form.register("name")}
              placeholder="e.g., Camping Morteratsch"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Location *</Label>
            <Tabs value={locationMethod} onValueChange={(v) => setLocationMethod(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="map" data-testid="tab-location-map">
                  <MapPin className="h-4 w-4 mr-2" />
                  Click on Map
                </TabsTrigger>
                <TabsTrigger value="address" data-testid="tab-location-address">
                  <Navigation className="h-4 w-4 mr-2" />
                  Address
                </TabsTrigger>
                <TabsTrigger value="coordinates" data-testid="tab-location-coordinates">
                  Coordinates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-4">
                {apiKey ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Click on the map to select the campground location</p>
                    <div className="h-64 rounded-lg overflow-hidden border">
                      <APIProvider apiKey={apiKey}>
                        <Map
                          mapId="spotfree-map"
                          center={mapCenter}
                          zoom={12}
                          onClick={handleMapClick}
                          gestureHandling="greedy"
                          disableDefaultUI={false}
                          className="w-full h-full"
                        >
                          {selectedPosition && (
                            <AdvancedMarker position={selectedPosition}>
                              <div className="bg-teal-500 border-2 border-teal-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                                <MapPin className="h-6 w-6 text-white" />
                              </div>
                            </AdvancedMarker>
                          )}
                        </Map>
                      </APIProvider>
                    </div>
                    {selectedPosition && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedPosition.lat.toFixed(4)}, {selectedPosition.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Google Maps API key not configured</p>
                )}
              </TabsContent>

              <TabsContent value="address" className="mt-4">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter campground address..."
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      data-testid="input-address"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          geocodeAddress();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={geocodeAddress}
                      disabled={isGeocoding}
                      data-testid="button-geocode"
                    >
                      {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
                    </Button>
                  </div>
                  {selectedPosition && (
                    <div className="h-48 rounded-lg overflow-hidden border">
                      <APIProvider apiKey={apiKey}>
                        <Map
                          mapId="spotfree-map"
                          center={mapCenter}
                          zoom={14}
                          gestureHandling="greedy"
                          disableDefaultUI={true}
                          className="w-full h-full"
                        >
                          <AdvancedMarker position={selectedPosition}>
                            <div className="bg-teal-500 border-2 border-teal-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                              <MapPin className="h-6 w-6 text-white" />
                            </div>
                          </AdvancedMarker>
                        </Map>
                      </APIProvider>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="coordinates" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lat">Latitude *</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      data-testid="input-latitude"
                      {...form.register("lat", { valueAsNumber: true })}
                      placeholder="46.6"
                    />
                    {form.formState.errors.lat && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.lat.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lng">Longitude *</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      data-testid="input-longitude"
                      {...form.register("lng", { valueAsNumber: true })}
                      placeholder="9.9"
                    />
                    {form.formState.errors.lng && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.lng.message}</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label htmlFor="region">Region *</Label>
            <Input
              id="region"
              data-testid="input-region"
              {...form.register("region")}
              placeholder="Engadin"
            />
            {form.formState.errors.region && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.region.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              data-testid="input-website"
              {...form.register("website")}
              placeholder="https://www.campground-website.com"
            />
            {form.formState.errors.website && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.website.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Remarks / Description</Label>
            <Textarea
              id="description"
              data-testid="input-description"
              {...form.register("description")}
              placeholder="Any additional information about this campground..."
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              data-testid="button-submit-campground"
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Campground
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
