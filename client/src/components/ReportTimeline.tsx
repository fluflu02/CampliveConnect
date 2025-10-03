import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvailabilityDisplay } from "./AvailabilityDisplay";

interface Report {
  id: string;
  userName: string;
  userInitials: string;
  motorhomeAvailability?: number | null;
  caravanAvailability?: number | null;
  vwBusAvailability?: number | null;
  largeTentAvailability?: number | null;
  smallTentAvailability?: number | null;
  verified?: boolean;
  timestamp: string;
}

interface ReportTimelineProps {
  reports: Report[];
}

export function ReportTimeline({ reports }: ReportTimelineProps) {
  return (
    <div className="space-y-6" data-testid="timeline-reports">
      {reports.map((report) => (
        <div key={report.id} className="flex gap-3" data-testid={`report-${report.id}`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{report.userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">{report.userName}</span>
              <span className="text-xs text-muted-foreground">{report.timestamp}</span>
            </div>
            <AvailabilityDisplay
              motorhomeAvailability={report.motorhomeAvailability}
              caravanAvailability={report.caravanAvailability}
              vwBusAvailability={report.vwBusAvailability}
              largeTentAvailability={report.largeTentAvailability}
              smallTentAvailability={report.smallTentAvailability}
              compact={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
