import { Button } from "@/components/ui/button";
import { Map, List, Heart, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Map, label: "Map", href: "/map", testId: "nav-map" },
    { icon: List, label: "List", href: "/campgrounds", testId: "nav-list" },
    { icon: Heart, label: "Following", href: "/following", testId: "nav-following" },
    { icon: User, label: "Profile", href: "/profile", testId: "nav-profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col h-auto py-2 px-3 gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                data-testid={item.testId}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
