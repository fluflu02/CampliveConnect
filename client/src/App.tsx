import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { AuthProvider, useAuth } from "@/lib/auth";
import Home from "@/pages/Home";
import MapPage from "@/pages/MapPage";
import CampgroundList from "@/pages/CampgroundList";
import CampgroundDetail from "@/pages/CampgroundDetail";
import Following from "@/pages/Following";
import AdminPage from "@/pages/AdminPage";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ProtectedRoute({ component: Component, requiredRole }: { component: () => JSX.Element; requiredRole?: string }) {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    } else if (requiredRole && user?.role !== requiredRole) {
      setLocation("/campgrounds");
    }
  }, [isAuthenticated, user, requiredRole, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/map" component={MapPage} />
      <Route path="/campgrounds" component={CampgroundList} />
      <Route path="/campground/:id" component={CampgroundDetail} />
      <Route path="/following">
        {() => <ProtectedRoute component={Following} />}
      </Route>
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminPage} requiredRole="admin" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
