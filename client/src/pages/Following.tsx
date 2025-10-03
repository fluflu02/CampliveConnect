import { CampgroundCard } from "@/components/CampgroundCard";
import { Bell } from "lucide-react";
import lakesideImage from "@assets/generated_images/Lakeside_campground_landscape_a490e214.png";
import mountainImage from "@assets/generated_images/Mountain_campground_scenic_view_5d210fdd.png";

export default function Following() {
  const followedCampgrounds = [
    {
      id: "1",
      name: "Pine Lake Campground",
      location: "Yosemite, CA",
      image: lakesideImage,
      status: "available" as const,
      verified: true,
      lastUpdated: "2h ago",
      reportCount: 5,
      isFollowing: true,
    },
    {
      id: "2",
      name: "Mountain View RV Park",
      location: "Rocky Mountains, CO",
      image: mountainImage,
      status: "full" as const,
      verified: false,
      lastUpdated: "4h ago",
      reportCount: 12,
      isFollowing: true,
    },
  ];

  return (
    <div className="min-h-screen p-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">Following</h1>
        </div>

        {followedCampgrounds.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              You're not following any campgrounds yet
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedCampgrounds.map((campground) => (
              <CampgroundCard key={campground.id} {...campground} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
