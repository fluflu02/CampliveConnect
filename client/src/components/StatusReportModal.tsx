import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

type StatusType = "available" | "full" | "unknown";

interface StatusReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campgroundName: string;
  onSubmit: (status: StatusType) => void;
}

export function StatusReportModal({
  open,
  onOpenChange,
  campgroundName,
  onSubmit,
}: StatusReportModalProps) {
  const handleStatusSelect = (status: StatusType) => {
    onSubmit(status);
    console.log(`Reported ${campgroundName} as ${status}`);
    onOpenChange(false);
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
