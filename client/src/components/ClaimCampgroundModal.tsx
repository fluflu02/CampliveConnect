import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Award, Mail } from "lucide-react";

interface ClaimCampgroundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campgroundId: string;
  campgroundName: string;
}

export function ClaimCampgroundModal({
  open,
  onOpenChange,
  campgroundId,
  campgroundName,
}: ClaimCampgroundModalProps) {
  const { toast } = useToast();
  const [ownerEmail, setOwnerEmail] = useState("");
  const [proofUrl, setProofUrl] = useState("");

  const claimMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/claims", {
        campgroundId,
        ownerEmail,
        proofUrl: proofUrl || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Claim submitted!",
        description: "Your ownership claim has been submitted for admin review. You'll be notified once it's approved.",
      });
      setOwnerEmail("");
      setProofUrl("");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["/api/campgrounds", campgroundId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit claim. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerEmail.trim()) {
      toast({
        title: "Error",
        description: "Please provide your email address",
        variant: "destructive",
      });
      return;
    }
    claimMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-claim-campground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" data-testid="text-claim-modal-title">
            <Award className="h-5 w-5" />
            Claim {campgroundName}
          </DialogTitle>
          <DialogDescription data-testid="text-claim-modal-description">
            Submit a claim to become the verified owner of this campground. An admin will review your request.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="owner-email" className="flex items-center gap-2" data-testid="label-owner-email">
              <Mail className="h-4 w-4" />
              Your Email Address
            </Label>
            <Input
              id="owner-email"
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="owner@campground.com"
              required
              data-testid="input-owner-email"
            />
            <p className="text-xs text-muted-foreground">
              We'll use this to verify your ownership
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proof-url" data-testid="label-proof-url">
              Proof of Ownership (Optional)
            </Label>
            <Textarea
              id="proof-url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="Link to official website, documents, or other proof..."
              rows={3}
              data-testid="input-proof-url"
            />
            <p className="text-xs text-muted-foreground">
              Provide links to documents or websites that prove ownership
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-claim"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={claimMutation.isPending}
              data-testid="button-submit-claim"
            >
              {claimMutation.isPending ? "Submitting..." : "Submit Claim"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
