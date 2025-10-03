import { CampgroundCard } from "@/components/CampgroundCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Campground } from "@shared/schema";
import lakesideImage from "@assets/generated_images/Lakeside_campground_landscape_a490e214.png";
import mountainImage from "@assets/generated_images/Mountain_campground_scenic_view_5d210fdd.png";

const defaultImages = [lakesideImage, mountainImage];

export default function Following() {
  const { data: followedIds, isLoading: loadingFollows } = useQuery<string[]>({
    queryKey: ["/api/follows"],
  });

  const { data: allCampgrounds, isLoading: loadingCampgrounds } = useQuery<Campground[]>({
    queryKey: ["/api/campgrounds"],
  });

  const isLoading = loadingFollows || loadingCampgrounds;

  const followedCampgrounds = allCampgrounds?.filter(
    (campground) => followedIds?.includes(campground.id)
  ) || [];

  return (
    <div className="min-h-screen p-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">Following</h1>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : followedCampgrounds.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              You're not following any campgrounds yet
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedCampgrounds.map((campground, idx) => (
              <CampgroundCard
                key={campground.id}
                id={campground.id}
                name={campground.name}
                location={campground.region}
                image={campground.imageUrl || defaultImages[idx % defaultImages.length]}
                status="unknown"
                verified={false}
                lastUpdated="Recently"
                reportCount={0}
                isFollowing={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
