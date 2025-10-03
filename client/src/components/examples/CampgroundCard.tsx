import { CampgroundCard } from "../CampgroundCard";
import lakesideImage from "@assets/generated_images/Lakeside_campground_landscape_a490e214.png";

export default function CampgroundCardExample() {
  return (
    <div className="max-w-sm">
      <CampgroundCard
        id="1"
        name="Pine Lake Campground"
        location="Yosemite, CA"
        image={lakesideImage}
        status="available"
        verified={true}
        lastUpdated="2h ago"
        reportCount={5}
        isFollowing={false}
      />
    </div>
  );
}
