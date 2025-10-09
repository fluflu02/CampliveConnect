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
import { Award, Mail, Zap } from "lucide-react";

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
      const response = await apiRequest("POST", "/api/claims", {
        campgroundId,
        ownerEmail,
        proofUrl: proofUrl || undefined,
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Update the auth token with the new owner role
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        // Decode and update user data
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        if (payload.user) {
          localStorage.setItem("auth_user", JSON.stringify(payload.user));
        }
      }
      
      toast({
        title: "Campground claimed successfully!",
        description: "You now have full owner access and can manage this campground immediately.",
      });
      setOwnerEmail("");
      setProofUrl("");
      onOpenChange(false);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/campgrounds", campgroundId] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/owner/campgrounds"] });
      
      // Reload the page to show updated UI with owner role
      setTimeout(() => window.location.reload(), 500);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to claim campground. Please try again.",
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
            <div className="space-y-2">
              <p>Claim this campground and get instant owner access!</p>
              <div className="flex items-center gap-2 text-sm text-foreground bg-teal-50 dark:bg-teal-950 p-2 rounded-md">
                <Zap className="h-4 w-4 text-teal-600" />
                <span>You'll immediately gain access to all owner features after claiming.</span>
              </div>
            </div>
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
