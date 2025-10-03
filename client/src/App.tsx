import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import Home from "@/pages/Home";
import MapPage from "@/pages/MapPage";
import CampgroundList from "@/pages/CampgroundList";
import CampgroundDetail from "@/pages/CampgroundDetail";
import Following from "@/pages/Following";
import OwnerDashboardPage from "@/pages/OwnerDashboardPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/map" component={MapPage} />
      <Route path="/campgrounds" component={CampgroundList} />
      <Route path="/campground/:id" component={CampgroundDetail} />
      <Route path="/following" component={Following} />
      <Route path="/owner-dashboard" component={OwnerDashboardPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
          <MobileNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
