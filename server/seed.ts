import { db } from "./db";
import { campgrounds } from "../shared/schema";

const sampleCampgrounds = [
  {
    name: "Pine Lake Campground",
    lat: 37.8651,
    lng: -119.5383,
    region: "Yosemite, CA",
    description: "Beautiful lakeside camping with stunning mountain views. Perfect for families and RVs. Features include electric hookups, water access, and nearby hiking trails.",
    capacity: 50,
    amenities: ["Restrooms", "Showers", "Electric Hookups", "Water Access"],
    imageUrl: "/assets/generated_images/Lakeside_campground_landscape_a490e214.png",
  },
  {
    name: "Mountain View RV Park",
    lat: 39.5501,
    lng: -105.7821,
    region: "Rocky Mountains, CO",
    description: "Premium RV park with full hookups and breathtaking mountain vistas. Family-friendly with playground and camp store on site.",
    capacity: 35,
    amenities: ["Full Hookups", "WiFi", "Playground", "Camp Store"],
    imageUrl: "/assets/generated_images/Mountain_campground_scenic_view_5d210fdd.png",
  },
  {
    name: "Riverside Camping",
    lat: 44.4280,
    lng: -110.5885,
    region: "Yellowstone, WY",
    description: "Peaceful riverside camping near Yellowstone National Park. Ideal for tent campers and small RVs seeking a natural experience.",
    capacity: 40,
    amenities: ["River Access", "Fire Pits", "Picnic Tables"],
    imageUrl: "/assets/generated_images/Lakeside_campground_landscape_a490e214.png",
  },
  {
    name: "Sequoia Grove Campground",
    lat: 36.4864,
    lng: -118.5658,
    region: "Sequoia, CA",
    description: "Camp among ancient sequoia trees in this serene forest setting. Popular with hikers and nature photographers.",
    capacity: 45,
    amenities: ["Restrooms", "Hiking Trails", "Fire Rings"],
    imageUrl: "/assets/generated_images/Mountain_campground_scenic_view_5d210fdd.png",
  },
  {
    name: "Desert Oasis RV Resort",
    lat: 36.1699,
    lng: -115.1398,
    region: "Las Vegas, NV",
    description: "Modern RV resort with pool and spa. Close to Las Vegas attractions while maintaining a peaceful desert atmosphere.",
    capacity: 60,
    amenities: ["Pool", "Spa", "Full Hookups", "WiFi", "Laundry"],
    imageUrl: "/assets/generated_images/Lakeside_campground_landscape_a490e214.png",
  },
];

async function seed() {
  console.log("Seeding campgrounds...");
  
  for (const campground of sampleCampgrounds) {
    await db.insert(campgrounds).values(campground);
    console.log(`Created: ${campground.name}`);
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
