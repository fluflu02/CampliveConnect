import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

type StatusType = "available" | "full" | "unknown";

interface StatusReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campgroundName: string;
  campgroundId?: string;
  onSubmit: (status: StatusType) => void;
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

  const reportMutation = useMutation({
    mutationFn: async (status: StatusType) => {
      if (!token) throw new Error("Not authenticated");
      if (!campgroundId) throw new Error("No campground selected");
      
      return apiRequest("POST", "/api/reports", {
        campgroundId,
        status,
      });
    },
    onSuccess: (data, status) => {
      queryClient.invalidateQueries({ queryKey: ["/api/campgrounds"] });
      if (campgroundId) {
        queryClient.invalidateQueries({ queryKey: ["/api/campgrounds", campgroundId] });
        queryClient.invalidateQueries({ queryKey: ["/api/campgrounds", campgroundId, "reports"] });
      }
      onSubmit(status);
      onOpenChange(false);
      toast({
        title: "Status reported",
        description: `Thank you for reporting ${campgroundName} as ${status}`,
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

  const handleStatusSelect = (status: StatusType) => {
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

    reportMutation.mutate(status);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-status-report">
        <DialogHeader>
          <DialogTitle>Report Status</DialogTitle>
          <DialogDescription>
            What's the current availability at {campgroundName}?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            size="lg"
            className="h-16 bg-[hsl(120,70%,45%)] hover:bg-[hsl(120,65%,40%)] text-white justify-start gap-3"
            onClick={() => handleStatusSelect("available")}
            disabled={reportMutation.isPending}
            data-testid="button-report-available"
          >
            <CheckCircle2 className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Available</div>
              <div className="text-xs opacity-90">Spots are free</div>
            </div>
          </Button>
          <Button
            size="lg"
            className="h-16 bg-[hsl(0,75%,50%)] hover:bg-[hsl(0,70%,45%)] text-white justify-start gap-3"
            onClick={() => handleStatusSelect("full")}
            disabled={reportMutation.isPending}
            data-testid="button-report-full"
          >
            <XCircle className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Full</div>
              <div className="text-xs opacity-90">No spots available</div>
            </div>
          </Button>
          <Button
            size="lg"
            className="h-16 bg-[hsl(210,15%,60%)] hover:bg-[hsl(210,15%,55%)] text-white justify-start gap-3"
            onClick={() => handleStatusSelect("unknown")}
            disabled={reportMutation.isPending}
            data-testid="button-report-unknown"
          >
            <HelpCircle className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Unknown</div>
              <div className="text-xs opacity-90">Not sure</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
