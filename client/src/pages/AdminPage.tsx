import { AdminPanel } from "@/components/AdminPanel";

export default function AdminPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-b">
          <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage claims and user subscriptions</p>
        </div>
        <AdminPanel />
      </div>
    </div>
  );
}
