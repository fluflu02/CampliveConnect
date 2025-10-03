import { db } from "./db";
import {
  users,
  campgrounds,
  statusReports,
  follows,
  claims,
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
} from "@shared/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";

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
  
  // Follow methods
  followCampground(follow: InsertFollow & { userId: string }): Promise<Follow>;
  unfollowCampground(userId: string, campgroundId: string): Promise<void>;
  getUserFollows(userId: string): Promise<string[]>;
  isFollowing(userId: string, campgroundId: string): Promise<boolean>;
  
  // Claim methods
  createClaim(claim: InsertClaim & { userId: string }): Promise<Claim>;
  getPendingClaims(): Promise<Array<Claim & { user: User; campground: Campground }>>;
  updateClaimState(id: string, state: "approved" | "rejected"): Promise<void>;
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
        status: statusReports.status,
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
}

export const storage = new DbStorage();
