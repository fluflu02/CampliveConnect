import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Tent, User } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/Logo_1759481723625.png";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center hover-elevate rounded-md px-2 py-1 -ml-2">
          <img src={logoImage} alt="SpotFree" className="h-10" />
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/campgrounds">
            <Button variant="ghost" data-testid="nav-link-campgrounds">
              Campgrounds
            </Button>
          </Link>
          <Link href="/owner-dashboard">
            <Button variant="ghost" data-testid="nav-link-owner">
              For Owners
            </Button>
          </Link>
          <ThemeToggle />
          <Button size="icon" variant="ghost" data-testid="button-user-menu">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
