import { ReportTimeline } from "../ReportTimeline";

export default function ReportTimelineExample() {
  const reports = [
    {
      id: "1",
      userName: "Sarah Chen",
      userInitials: "SC",
      status: "available" as const,
      verified: true,
      timestamp: "2h ago",
    },
    {
      id: "2",
      userName: "Mike Johnson",
      userInitials: "MJ",
      status: "full" as const,
      timestamp: "5h ago",
    },
    {
      id: "3",
      userName: "Emily Davis",
      userInitials: "ED",
      status: "available" as const,
      timestamp: "8h ago",
    },
  ];

  return (
    <div className="max-w-md">
      <ReportTimeline reports={reports} />
    </div>
  );
}
