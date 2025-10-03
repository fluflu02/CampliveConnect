import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, verifyPassword, generateToken, requireAuth, requireRole, type AuthRequest } from "./auth";
import { insertUserSchema, insertStatusReportSchema, insertFollowSchema, insertClaimSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = insertUserSchema.parse(req.body);
      
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        role: "camper",
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const valid = await verifyPassword(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  // Campground routes
  app.get("/api/campgrounds", async (req, res) => {
    try {
      const { search } = req.query;
      
      const campgrounds = search 
        ? await storage.searchCampgrounds(search as string)
        : await storage.getCampgrounds();

      const campgroundsWithAvailability = await Promise.all(
        campgrounds.map(async (campground) => {
          const availability = await storage.getLatestAvailability(campground.id);
          return {
            ...campground,
            ...availability,
          };
        })
      );

      res.json(campgroundsWithAvailability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campgrounds" });
    }
  });

  app.get("/api/campgrounds/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const campground = await storage.getCampgroundById(id);

      if (!campground) {
        return res.status(404).json({ message: "Campground not found" });
      }

      const availability = await storage.getLatestAvailability(id);

      res.json({
        ...campground,
        ...availability,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campground" });
    }
  });

  app.post("/api/campgrounds", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { insertCampgroundSchema } = await import("@shared/schema");
      const data = insertCampgroundSchema.parse(req.body);
      const campground = await storage.createCampground(data);
      res.json(campground);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create campground" });
    }
  });

  // Status report routes
  app.post("/api/reports", requireAuth, async (req: AuthRequest, res) => {
    try {
      const data = insertStatusReportSchema.parse(req.body);
      const report = await storage.createStatusReport({
        ...data,
        userId: req.user!.id,
      });

      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/campgrounds/:id/reports", async (req, res) => {
    try {
      const { id } = req.params;
      const reports = await storage.getRecentReports(id, 12);

      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Follow routes
  app.post("/api/follow", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { campgroundId } = insertFollowSchema.parse(req.body);
      
      const isFollowing = await storage.isFollowing(req.user!.id, campgroundId);
      if (isFollowing) {
        return res.status(400).json({ message: "Already following this campground" });
      }

      const follow = await storage.followCampground({
        campgroundId,
        userId: req.user!.id,
      });

      res.json(follow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to follow campground" });
    }
  });

  app.delete("/api/follow/:campgroundId", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { campgroundId } = req.params;
      await storage.unfollowCampground(req.user!.id, campgroundId);

      res.json({ message: "Unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unfollow campground" });
    }
  });

  app.get("/api/follows", requireAuth, async (req: AuthRequest, res) => {
    try {
      const follows = await storage.getUserFollows(req.user!.id);
      res.json(follows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch follows" });
    }
  });

  // Claim routes
  app.post("/api/claims", requireAuth, async (req: AuthRequest, res) => {
    try {
      const data = insertClaimSchema.parse(req.body);
      const claim = await storage.createClaim({
        ...data,
        userId: req.user!.id,
      });

      res.json(claim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create claim" });
    }
  });

  // Admin routes
  app.get("/api/admin/claims", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
    try {
      const claims = await storage.getPendingClaims();
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claims" });
    }
  });

  app.patch("/api/admin/claims/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { state } = req.body;

      if (!["approved", "rejected"].includes(state)) {
        return res.status(400).json({ message: "Invalid state" });
      }

      await storage.updateClaimState(id, state);

      if (state === "approved") {
        const claims = await storage.getPendingClaims();
        const claim = claims.find(c => c.id === id);
        if (claim) {
          await storage.updateUserRole(claim.userId, "owner");
        }
      }

      res.json({ message: "Claim updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update claim" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
