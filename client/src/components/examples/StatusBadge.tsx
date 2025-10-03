import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <StatusBadge status="available" />
      <StatusBadge status="available" verified />
      <StatusBadge status="full" />
      <StatusBadge status="unknown" />
    </div>
  );
}
