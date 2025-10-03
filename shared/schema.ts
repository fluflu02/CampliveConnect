import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, pgEnum, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["camper", "owner", "admin"]);
export const statusEnum = pgEnum("status", ["available", "full", "unknown"]);
export const claimStateEnum = pgEnum("claim_state", ["pending", "approved", "rejected"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "cancelled", "expired"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("camper"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const campgrounds = pgTable("campgrounds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  region: text("region").notNull(),
  description: text("description"),
  capacity: integer("capacity"),
  amenities: text("amenities").array(),
  imageUrl: text("image_url"),
  ownerUserId: varchar("owner_user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const statusReports = pgTable("status_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campgroundId: varchar("campground_id").notNull().references(() => campgrounds.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  motorhomeAvailability: integer("motorhome_availability"),
  caravanAvailability: integer("caravan_availability"),
  vwBusAvailability: integer("vw_bus_availability"),
  largeTentAvailability: integer("large_tent_availability"),
  smallTentAvailability: integer("small_tent_availability"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const operatorOverrides = pgTable("operator_overrides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campgroundId: varchar("campground_id").notNull().references(() => campgrounds.id, { onDelete: "cascade" }),
  motorhomeAvailability: integer("motorhome_availability"),
  caravanAvailability: integer("caravan_availability"),
  vwBusAvailability: integer("vw_bus_availability"),
  largeTentAvailability: integer("large_tent_availability"),
  smallTentAvailability: integer("small_tent_availability"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const follows = pgTable("follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  campgroundId: varchar("campground_id").notNull().references(() => campgrounds.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  campgroundId: varchar("campground_id").references(() => campgrounds.id, { onDelete: "cascade" }),
  plan: text("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const claims = pgTable("claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campgroundId: varchar("campground_id").notNull().references(() => campgrounds.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  proofUrl: text("proof_url"),
  state: claimStateEnum("state").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email(),
  password: z.string().min(8),
});

export const insertCampgroundSchema = createInsertSchema(campgrounds).omit({
  id: true,
  createdAt: true,
});

export const insertStatusReportSchema = createInsertSchema(statusReports).omit({
  id: true,
  createdAt: true,
  userId: true,
}).extend({
  motorhomeAvailability: z.number().min(0).max(100).optional(),
  caravanAvailability: z.number().min(0).max(100).optional(),
  vwBusAvailability: z.number().min(0).max(100).optional(),
  largeTentAvailability: z.number().min(0).max(100).optional(),
  smallTentAvailability: z.number().min(0).max(100).optional(),
});

export const insertOperatorOverrideSchema = createInsertSchema(operatorOverrides).omit({
  id: true,
  createdAt: true,
}).extend({
  motorhomeAvailability: z.number().min(0).max(100).optional(),
  caravanAvailability: z.number().min(0).max(100).optional(),
  vwBusAvailability: z.number().min(0).max(100).optional(),
  largeTentAvailability: z.number().min(0).max(100).optional(),
  smallTentAvailability: z.number().min(0).max(100).optional(),
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  createdAt: true,
  userId: true,
}).extend({
  state: z.enum(["pending", "approved", "rejected"]).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCampground = z.infer<typeof insertCampgroundSchema>;
export type Campground = typeof campgrounds.$inferSelect;

export type InsertStatusReport = z.infer<typeof insertStatusReportSchema>;
export type StatusReport = typeof statusReports.$inferSelect;

export type InsertOperatorOverride = z.infer<typeof insertOperatorOverrideSchema>;
export type OperatorOverride = typeof operatorOverrides.$inferSelect;

export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Follow = typeof follows.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof claims.$inferSelect;
