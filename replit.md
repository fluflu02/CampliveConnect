# CampLive - Real-Time Campground Availability Tracker

## Overview
CampLive is a progressive web app that provides real-time campground availability through community reporting and owner verification. The platform supports multiple user roles (campers, owners, admins) with features including push notifications, Stripe subscriptions, and comprehensive moderation tools.

**Current Status:** Core functionality complete - authentication, campground listing, community reporting, following, and admin claim management are fully operational.

## Recent Changes (October 3, 2025)
- ✅ Fixed query client to properly handle search parameters with URL query strings
- ✅ Resolved status report cache invalidation to refresh list, detail, and timeline views
- ✅ Synchronized follow state between frontend and backend with proper cache updates
- ✅ Validated all API endpoints and authentication flow working correctly
- ✅ Confirmed loading states and error handling across all user interactions

## Project Architecture

### Technology Stack
- **Frontend:** React with TypeScript, Wouter for routing, TanStack Query for data fetching
- **Backend:** Express.js with TypeScript
- **Database:** Supabase/Neon PostgreSQL with Drizzle ORM
- **Authentication:** JWT tokens with bcrypt password hashing
- **Styling:** Tailwind CSS with custom forest green/teal outdoor theme
- **UI Components:** Shadcn components with custom design system

### Database Schema
- **users:** Authentication and role management (camper/owner/admin)
- **campgrounds:** Campground directory with location, region, facilities
- **status_reports:** Community reports with 12-hour visibility window
- **follows:** User preferences for push notifications
- **owner_claims:** Ownership verification workflow
- **operator_overrides:** Owner-verified status with expiry
- **subscriptions:** Stripe Pro account tracking (ready for integration)

### Key Design Decisions
- **In-Memory Storage:** Currently using MemStorage adapter for development
- **WebSocket SSL:** Configured NODE_TLS_REJECT_UNAUTHORIZED=0 for development only
- **Role-Based Access:** Middleware enforcement at API level with requireAuth/requireRole
- **Cache Strategy:** Hierarchical query keys for granular invalidation
- **Follow State:** Centralized in /api/follows query, synced via useEffect in cards

## User Preferences
- Mobile-first responsive design with outdoor-themed color palette
- Forest green (#2D5016) and teal accents for nature-inspired UI
- Smooth animations and hover effects for polished experience
- Clear visual hierarchy with status badges and verification indicators

## Pending Features
1. **Owner Features:** Complete owner dashboard with status override UI
2. **Stripe Integration:** Checkout flow and webhook handling for Pro subscriptions
3. **Push Notifications:** Firebase Cloud Messaging for follower alerts
4. **Map Integration:** Visual campground discovery with Mapbox/Leaflet

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/campgrounds` - List campgrounds (supports ?search= query)
- `GET /api/campgrounds/:id` - Campground details
- `GET /api/campgrounds/:id/reports` - Status report timeline
- `POST /api/reports` - Submit status report
- `POST /api/follow` - Follow campground
- `DELETE /api/follow/:id` - Unfollow campground
- `GET /api/follows` - User's followed campgrounds
- `GET /api/admin/claims` - List ownership claims (admin only)
- `PUT /api/admin/claims/:id` - Approve/reject claim (admin only)

## Security Notes
- JWT tokens stored in localStorage with AuthProvider context
- Protected routes check authentication before rendering
- Server middleware validates tokens and enforces role permissions
- Passwords hashed with bcrypt before storage
- Development database only - production database not accessible via tools
