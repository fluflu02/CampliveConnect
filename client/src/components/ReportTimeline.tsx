import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "./StatusBadge";

type StatusType = "available" | "full" | "unknown";

interface Report {
  id: string;
  userName: string;
  userInitials: string;
  status: StatusType;
  verified?: boolean;
  timestamp: string;
}

interface ReportTimelineProps {
  reports: Report[];
}

export function ReportTimeline({ reports }: ReportTimelineProps) {
  return (
    <div className="space-y-4" data-testid="timeline-reports">
      {reports.map((report, index) => (
        <div key={report.id} className="flex gap-3" data-testid={`report-${report.id}`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{report.userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{report.userName}</span>
              <span className="text-xs text-muted-foreground">{report.timestamp}</span>
            </div>
            <StatusBadge status={report.status} verified={report.verified} />
          </div>
        </div>
      ))}
    </div>
  );
}
