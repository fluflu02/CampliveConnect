import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AvailabilitySlider } from "./AvailabilitySlider";
import { useState } from "react";

interface AvailabilityData {
  motorhomeAvailability?: number;
  caravanAvailability?: number;
  vwBusAvailability?: number;
  largeTentAvailability?: number;
  smallTentAvailability?: number;
}

interface StatusReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campgroundName: string;
  campgroundId?: string;
  onSubmit: () => void;
}

export function StatusReportModal({
  open,
  onOpenChange,
  campgroundName,
  campgroundId,
  onSubmit,
}: StatusReportModalProps) {
  const { token, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [availability, setAvailability] = useState<AvailabilityData>({
    motorhomeAvailability: 50,
    caravanAvailability: 50,
    vwBusAvailability: 50,
    largeTentAvailability: 50,
    smallTentAvailability: 50,
  });

  const reportMutation = useMutation({
    mutationFn: async (data: AvailabilityData) => {
      if (!token) throw new Error("Not authenticated");
      if (!campgroundId) throw new Error("No campground selected");
      
      return apiRequest("POST", "/api/reports", {
        campgroundId,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campgrounds"] });
      if (campgroundId) {
        queryClient.invalidateQueries({ queryKey: ["/api/campgrounds", campgroundId] });
        queryClient.invalidateQueries({ queryKey: ["/api/campgrounds", campgroundId, "reports"] });
      }
      onSubmit();
      onOpenChange(false);
      toast({
        title: "Status reported",
        description: `Thank you for updating availability at ${campgroundName}`,
      });
      setAvailability({
        motorhomeAvailability: 50,
        caravanAvailability: 50,
        vwBusAvailability: 50,
        largeTentAvailability: 50,
        smallTentAvailability: 50,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit report",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to report campground status",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }

    if (!campgroundId) {
      toast({
        title: "Error",
        description: "Please select a campground first",
        variant: "destructive",
      });
      return;
    }

    reportMutation.mutate(availability);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="modal-status-report">
        <DialogHeader>
          <DialogTitle>Report Availability</DialogTitle>
          <DialogDescription>
            Update the current availability at {campgroundName}. Adjust sliders from 0% (full) to 100% (empty).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <AvailabilitySlider
            category="motorhome"
            value={availability.motorhomeAvailability || 50}
            onChange={(val) => setAvailability({ ...availability, motorhomeAvailability: val })}
          />
          <AvailabilitySlider
            category="caravan"
            value={availability.caravanAvailability || 50}
            onChange={(val) => setAvailability({ ...availability, caravanAvailability: val })}
          />
          <AvailabilitySlider
            category="vwBus"
            value={availability.vwBusAvailability || 50}
            onChange={(val) => setAvailability({ ...availability, vwBusAvailability: val })}
          />
          <AvailabilitySlider
            category="largeTent"
            value={availability.largeTentAvailability || 50}
            onChange={(val) => setAvailability({ ...availability, largeTentAvailability: val })}
          />
          <AvailabilitySlider
            category="smallTent"
            value={availability.smallTentAvailability || 50}
            onChange={(val) => setAvailability({ ...availability, smallTentAvailability: val })}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={reportMutation.isPending}
            data-testid="button-cancel-report"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={reportMutation.isPending}
            data-testid="button-submit-report"
          >
            {reportMutation.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
