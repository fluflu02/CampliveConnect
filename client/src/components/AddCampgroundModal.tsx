import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCampgroundSchema, type InsertCampground } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddCampgroundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCampgroundModal({ open, onOpenChange }: AddCampgroundModalProps) {
  const { toast } = useToast();
  
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
      return await apiRequest("/api/campgrounds", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campgrounds"] });
      toast({
        title: "Success",
        description: "Campground added successfully",
      });
      form.reset();
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
