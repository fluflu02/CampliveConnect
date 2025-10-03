import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";

type StatusType = "available" | "full" | "unknown";

interface CampgroundCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  status: StatusType;
  verified?: boolean;
  lastUpdated: string;
  reportCount: number;
  isFollowing?: boolean;
  onFollow?: () => void;
}

export function CampgroundCard({
  id,
  name,
  location,
  image,
  status,
  verified = false,
  lastUpdated,
  reportCount,
  isFollowing = false,
  onFollow,
}: CampgroundCardProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = () => {
    setFollowing(!following);
    onFollow?.();
    console.log(`${following ? 'Unfollowed' : 'Followed'} ${name}`);
  };

  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-campground-${id}`}>
      <div className="relative aspect-video">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} verified={verified} />
        </div>
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 left-2 ${following ? 'text-red-500' : 'text-white'} bg-black/30 backdrop-blur-sm hover:bg-black/50`}
          onClick={handleFollow}
          data-testid={`button-follow-${id}`}
        >
          <Heart className={`h-4 w-4 ${following ? 'fill-current' : ''}`} />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1" data-testid={`text-campground-name-${id}`}>
          {name}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground gap-1 mb-2">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{lastUpdated}</span>
          </div>
          <span>{reportCount} {reportCount === 1 ? 'report' : 'reports'}</span>
        </div>
      </div>
    </Card>
  );
}
