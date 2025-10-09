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
  const { data: claims, isLoading } = useQuery<ClaimWithDetails[]>({
    queryKey: ["/api/admin/claims"],
  });

  const allClaims = claims || [];

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Campground Ownership Claims</CardTitle>
          <CardDescription>
            Claims are automatically approved - owners get instant access to their campground management features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : allClaims.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No claims yet</p>
          ) : (
            <div className="space-y-4">
              {allClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  data-testid={`claim-${claim.id}`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{claim.campground?.name || "Unknown Campground"}</h4>
                      <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800">
                        <Check className="h-3 w-3 mr-1" />
                        Auto-Approved
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Owner: {claim.user?.name || "Unknown User"} ({claim.user?.email || "no email"})
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
