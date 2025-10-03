import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ExternalLink } from "lucide-react";

interface Claim {
  id: string;
  campgroundName: string;
  userName: string;
  userEmail: string;
  proofUrl: string;
  submittedAt: string;
}

export function AdminPanel() {
  const pendingClaims: Claim[] = [
    {
      id: "1",
      campgroundName: "Pine Lake Campground",
      userName: "John Smith",
      userEmail: "john@example.com",
      proofUrl: "#",
      submittedAt: "2 hours ago",
    },
    {
      id: "2",
      campgroundName: "Mountain View RV Park",
      userName: "Sarah Johnson",
      userEmail: "sarah@example.com",
      proofUrl: "#",
      submittedAt: "5 hours ago",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Claims</CardTitle>
          <CardDescription>Review and approve campground ownership claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingClaims.map((claim) => (
              <div
                key={claim.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`claim-${claim.id}`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{claim.campgroundName}</h4>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {claim.userName} ({claim.userEmail})
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{claim.submittedAt}</span>
                    <span>•</span>
                    <a
                      href={claim.proofUrl}
                      className="text-primary hover:underline flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View proof <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[hsl(120,70%,45%)] border-[hsl(120,70%,45%)]"
                    data-testid={`button-approve-${claim.id}`}
                    onClick={() => console.log(`Approved claim ${claim.id}`)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[hsl(0,75%,50%)] border-[hsl(0,75%,50%)]"
                    data-testid={`button-reject-${claim.id}`}
                    onClick={() => console.log(`Rejected claim ${claim.id}`)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
