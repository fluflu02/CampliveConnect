import { OwnerDashboard } from "@/components/OwnerDashboard";

export default function OwnerDashboardPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-b">
          <h1 className="font-display text-2xl font-bold">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your campground and subscribers</p>
        </div>
        <OwnerDashboard />
      </div>
    </div>
  );
}
