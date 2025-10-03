import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

type StatusType = "available" | "full" | "unknown";

interface StatusBadgeProps {
  status: StatusType;
  verified?: boolean;
  className?: string;
}

const statusConfig = {
  available: {
    label: "Available",
    color: "bg-[hsl(120,70%,45%)] text-white hover:bg-[hsl(120,70%,45%)]",
    icon: CheckCircle2,
  },
  full: {
    label: "Full",
    color: "bg-[hsl(0,75%,50%)] text-white hover:bg-[hsl(0,75%,50%)]",
    icon: XCircle,
  },
  unknown: {
    label: "Unknown",
    color: "bg-[hsl(210,15%,60%)] text-white hover:bg-[hsl(210,15%,60%)]",
    icon: HelpCircle,
  },
};

export function StatusBadge({ status, verified = false, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.color} gap-1 ${className}`}
      data-testid={`badge-status-${status}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
      {verified && <span className="ml-1">✓</span>}
    </Badge>
  );
}
