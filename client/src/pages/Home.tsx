import { Button } from "@/components/ui/button";
import { MapPin, Users, Bell, Zap } from "lucide-react";
import heroImage from "@assets/generated_images/Campground_hero_image_golden_hour_0c03d5be.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[600px] overflow-hidden">
        <img
          src={heroImage}
          alt="Scenic campground at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
            Find Your Perfect Campsite
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Real-time campground availability powered by community reports and verified updates
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 border-2 border-white"
              data-testid="button-explore"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Explore Campgrounds
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-2 border-white bg-black/20 backdrop-blur-sm hover:bg-black/30"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          How CampLive Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Find Campgrounds</h3>
            <p className="text-muted-foreground">
              Browse campgrounds on an interactive map and see real-time availability status
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Community Reports</h3>
            <p className="text-muted-foreground">
              Campers share availability updates to help the community find open spots
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Get Notified</h3>
            <p className="text-muted-foreground">
              Follow campgrounds and receive instant push notifications about availability
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-4">
              Campground Owners
            </h2>
            <p className="text-muted-foreground mb-8">
              Claim your campground, verify availability status, and send push notifications to your followers. 
              Pro subscription includes advanced features and analytics.
            </p>
            <Button size="lg" data-testid="button-claim-campground">
              Claim Your Campground
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
