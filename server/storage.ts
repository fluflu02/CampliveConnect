import { db } from "./db";
import {
  users,
  campgrounds,
  statusReports,
  follows,
  claims,
  availabilityForecasts,
  announcements,
  type User,
  type InsertUser,
  type Campground,
  type InsertCampground,
  type StatusReport,
  type InsertStatusReport,
  type Follow,
  type InsertFollow,
  type Claim,
  type InsertClaim,
  type AvailabilityForecast,
  type InsertAvailabilityForecast,
  type Announcement,
  type InsertAnnouncement,
} from "@shared/schema";
import { eq, and, desc, gte, sql, lte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(id: string, role: "camper" | "owner" | "admin"): Promise<void>;

  // Campground methods
  getCampgrounds(): Promise<Campground[]>;
  getCampgroundById(id: string): Promise<Campground | undefined>;
  createCampground(campground: InsertCampground): Promise<Campground>;
  searchCampgrounds(query: string): Promise<Campground[]>;

  // Status report methods
  createStatusReport(report: InsertStatusReport & { userId: string }): Promise<StatusReport>;
  getRecentReports(campgroundId: string, hours?: number): Promise<Array<StatusReport & { user: User }>>;
  getLatestAvailability(campgroundId: string): Promise<Omit<StatusReport, 'id' | 'userId' | 'campgroundId' | 'createdAt'> | null>;
  
  // Follow methods
  followCampground(follow: InsertFollow & { userId: string }): Promise<Follow>;
  unfollowCampground(userId: string, campgroundId: string): Promise<void>;
  getUserFollows(userId: string): Promise<string[]>;
  isFollowing(userId: string, campgroundId: string): Promise<boolean>;
  
  // Claim methods
  createClaim(claim: InsertClaim & { userId: string }): Promise<Claim>;
  getPendingClaims(): Promise<Array<Claim & { user: User; campground: Campground }>>;
  updateClaimState(id: string, state: "approved" | "rejected"): Promise<void>;
  approveClaim(claimId: string, campgroundId: string, userId: string): Promise<void>;

  // Forecast methods
  createOrUpdateForecast(forecast: InsertAvailabilityForecast): Promise<AvailabilityForecast>;
  getForecasts(campgroundId: string, days?: number): Promise<AvailabilityForecast[]>;
  
  // Announcement methods
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  getCampgroundAnnouncements(campgroundId: string, limit?: number): Promise<Announcement[]>;
  
  // Campground update methods
  updateCampgroundOwnership(campgroundId: string, userId: string, verified: boolean): Promise<void>;
  updateNotificationPreference(userId: string, enabled: boolean): Promise<void>;
  getFollowersForCampground(campgroundId: string): Promise<User[]>;
}

class DbStorage implements IStorage {
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserRole(id: string, role: "camper" | "owner" | "admin"): Promise<void> {
    await db.update(users).set({ role }).where(eq(users.id, id));
  }

  async getCampgrounds(): Promise<Campground[]> {
    return db.select().from(campgrounds);
  }

  async getCampgroundById(id: string): Promise<Campground | undefined> {
    const [campground] = await db.select().from(campgrounds).where(eq(campgrounds.id, id)).limit(1);
    return campground;
  }

  async createCampground(campground: InsertCampground): Promise<Campground> {
    const [newCampground] = await db.insert(campgrounds).values(campground).returning();
    return newCampground;
  }

  async searchCampgrounds(query: string): Promise<Campground[]> {
    return db.select().from(campgrounds).where(
      sql`${campgrounds.name} ILIKE ${`%${query}%`} OR ${campgrounds.region} ILIKE ${`%${query}%`}`
    );
  }

  async createStatusReport(report: InsertStatusReport & { userId: string }): Promise<StatusReport> {
    const [newReport] = await db.insert(statusReports).values(report).returning();
    return newReport;
  }

  async getRecentReports(campgroundId: string, hours: number = 12): Promise<Array<StatusReport & { user: User }>> {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const reports = await db
      .select({
        id: statusReports.id,
        campgroundId: statusReports.campgroundId,
        userId: statusReports.userId,
        motorhomeAvailability: statusReports.motorhomeAvailability,
        caravanAvailability: statusReports.caravanAvailability,
        vwBusAvailability: statusReports.vwBusAvailability,
        largeTentAvailability: statusReports.largeTentAvailability,
        smallTentAvailability: statusReports.smallTentAvailability,
        createdAt: statusReports.createdAt,
        user: users,
      })
      .from(statusReports)
      .innerJoin(users, eq(statusReports.userId, users.id))
      .where(
        and(
          eq(statusReports.campgroundId, campgroundId),
          gte(statusReports.createdAt, cutoffTime)
        )
      )
      .orderBy(desc(statusReports.createdAt));

    return reports;
  }

  async getLatestAvailability(campgroundId: string): Promise<Omit<StatusReport, 'id' | 'userId' | 'campgroundId' | 'createdAt'> | null> {
    const cutoffTime = new Date(Date.now() - 12 * 60 * 60 * 1000);
    
    const [latestReport] = await db
      .select({
        motorhomeAvailability: statusReports.motorhomeAvailability,
        caravanAvailability: statusReports.caravanAvailability,
        vwBusAvailability: statusReports.vwBusAvailability,
        largeTentAvailability: statusReports.largeTentAvailability,
        smallTentAvailability: statusReports.smallTentAvailability,
      })
      .from(statusReports)
      .where(
        and(
          eq(statusReports.campgroundId, campgroundId),
          gte(statusReports.createdAt, cutoffTime)
        )
      )
      .orderBy(desc(statusReports.createdAt))
      .limit(1);

    return latestReport || null;
  }

  async followCampground(follow: InsertFollow & { userId: string }): Promise<Follow> {
    const [newFollow] = await db.insert(follows).values(follow).returning();
    return newFollow;
  }

  async unfollowCampground(userId: string, campgroundId: string): Promise<void> {
    await db.delete(follows).where(
      and(
        eq(follows.userId, userId),
        eq(follows.campgroundId, campgroundId)
      )
    );
  }

  async getUserFollows(userId: string): Promise<string[]> {
    const userFollows = await db
      .select({ campgroundId: follows.campgroundId })
      .from(follows)
      .where(eq(follows.userId, userId));
    
    return userFollows.map(f => f.campgroundId);
  }

  async isFollowing(userId: string, campgroundId: string): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.userId, userId),
          eq(follows.campgroundId, campgroundId)
        )
      )
      .limit(1);
    
    return !!follow;
  }

  async createClaim(claim: InsertClaim & { userId: string }): Promise<Claim> {
    const [newClaim] = await db.insert(claims).values(claim).returning();
    return newClaim;
  }

  async getPendingClaims(): Promise<Array<Claim & { user: User; campground: Campground }>> {
    const pendingClaims = await db
      .select({
        id: claims.id,
        campgroundId: claims.campgroundId,
        userId: claims.userId,
        proofUrl: claims.proofUrl,
        ownerEmail: claims.ownerEmail,
        verificationCode: claims.verificationCode,
        state: claims.state,
        createdAt: claims.createdAt,
        user: users,
        campground: campgrounds,
      })
      .from(claims)
      .innerJoin(users, eq(claims.userId, users.id))
      .innerJoin(campgrounds, eq(claims.campgroundId, campgrounds.id))
      .where(eq(claims.state, "pending"))
      .orderBy(desc(claims.createdAt));

    return pendingClaims;
  }

  async updateClaimState(id: string, state: "approved" | "rejected"): Promise<void> {
    await db.update(claims).set({ state }).where(eq(claims.id, id));
  }

  async approveClaim(claimId: string, campgroundId: string, userId: string): Promise<void> {
    await db.update(claims).set({ state: "approved" }).where(eq(claims.id, claimId));
    await db.update(campgrounds).set({ 
      ownerUserId: userId,
      isVerifiedOwner: true 
    }).where(eq(campgrounds.id, campgroundId));
    await db.update(users).set({ role: "owner" }).where(eq(users.id, userId));
  }

  async createOrUpdateForecast(forecast: InsertAvailabilityForecast): Promise<AvailabilityForecast> {
    const [existing] = await db
      .select()
      .from(availabilityForecasts)
      .where(
        and(
          eq(availabilityForecasts.campgroundId, forecast.campgroundId),
          eq(availabilityForecasts.date, forecast.date)
        )
      )
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(availabilityForecasts)
        .set({ 
          ...forecast,
          updatedAt: new Date(),
        })
        .where(eq(availabilityForecasts.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newForecast] = await db
        .insert(availabilityForecasts)
        .values(forecast)
        .returning();
      return newForecast;
    }
  }

  async getForecasts(campgroundId: string, days: number = 7): Promise<AvailabilityForecast[]> {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    return db
      .select()
      .from(availabilityForecasts)
      .where(
        and(
          eq(availabilityForecasts.campgroundId, campgroundId),
          lte(availabilityForecasts.date, endDate)
        )
      )
      .orderBy(availabilityForecasts.date);
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values(announcement)
      .returning();
    return newAnnouncement;
  }

  async getCampgroundAnnouncements(campgroundId: string, limit: number = 10): Promise<Announcement[]> {
    return db
      .select()
      .from(announcements)
      .where(eq(announcements.campgroundId, campgroundId))
      .orderBy(desc(announcements.createdAt))
      .limit(limit);
  }

  async updateCampgroundOwnership(campgroundId: string, userId: string, verified: boolean): Promise<void> {
    await db
      .update(campgrounds)
      .set({ 
        ownerUserId: userId,
        isVerifiedOwner: verified 
      })
      .where(eq(campgrounds.id, campgroundId));
  }

  async updateNotificationPreference(userId: string, enabled: boolean): Promise<void> {
    await db
      .update(users)
      .set({ notificationsEnabled: enabled })
      .where(eq(users.id, userId));
  }

  async getFollowersForCampground(campgroundId: string): Promise<User[]> {
    const followers = await db
      .select({ user: users })
      .from(follows)
      .innerJoin(users, eq(follows.userId, users.id))
      .where(
        and(
          eq(follows.campgroundId, campgroundId),
          eq(follows.notifyOnAvailability, true),
          eq(users.notificationsEnabled, true)
        )
      );
    
    return followers.map(f => f.user);
  }
}

export const storage = new DbStorage();
