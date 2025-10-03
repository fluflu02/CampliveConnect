import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, ExternalLink } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface ClaimWithDetails {
  id: string;
  campgroundId: string;
  userId: string;
  proofUrl: string | null;
  state: string;
  createdAt: string;
  campground?: {
    name: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export function AdminPanel() {
  const { toast } = useToast();

  const { data: claims, isLoading } = useQuery<ClaimWithDetails[]>({
    queryKey: ["/api/admin/claims"],
  });

  const updateClaimMutation = useMutation({
    mutationFn: async ({ id, state }: { id: string; state: "approved" | "rejected" }) => {
      return apiRequest("PATCH", `/api/admin/claims/${id}`, { state });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/claims"] });
      toast({
        title: variables.state === "approved" ? "Claim approved" : "Claim rejected",
        description: `The ownership claim has been ${variables.state}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update claim",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (claimId: string) => {
    updateClaimMutation.mutate({ id: claimId, state: "approved" });
  };

  const handleReject = (claimId: string) => {
    updateClaimMutation.mutate({ id: claimId, state: "rejected" });
  };

  const pendingClaims = claims?.filter(claim => claim.state === "pending") || [];

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Claims</CardTitle>
          <CardDescription>Review and approve campground ownership claims</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : pendingClaims.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No pending claims</p>
          ) : (
            <div className="space-y-4">
              {pendingClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  data-testid={`claim-${claim.id}`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{claim.campground?.name || "Unknown Campground"}</h4>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {claim.user?.name || "Unknown User"} ({claim.user?.email || "no email"})
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(claim.createdAt), { addSuffix: true })}</span>
                      {claim.proofUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={claim.proofUrl}
                            className="text-primary hover:underline flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View proof <ExternalLink className="h-3 w-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[hsl(120,70%,45%)] border-[hsl(120,70%,45%)]"
                      data-testid={`button-approve-${claim.id}`}
                      onClick={() => handleApprove(claim.id)}
                      disabled={updateClaimMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[hsl(0,75%,50%)] border-[hsl(0,75%,50%)]"
                      data-testid={`button-reject-${claim.id}`}
                      onClick={() => handleReject(claim.id)}
                      disabled={updateClaimMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
