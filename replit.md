# SpotFree - Real-Time Campground Availability Tracker

## Overview
SpotFree is a progressive web app that provides real-time campground availability through community reporting and owner verification. The platform supports multiple user roles (campers, owners, admins) with features including push notifications, Stripe subscriptions, and comprehensive moderation tools.

**Current Status:** Core functionality complete with Google Maps integration and PWA support. The app is centered on Engadin, Switzerland region with interactive map on the home screen.

## Recent Changes (October 3, 2025)
- ✅ Added Google Maps integration with @vis.gl/react-google-maps library
- ✅ Configured map centered on Engadin, Switzerland (lat: 46.6, lng: 9.9)
- ✅ Moved interactive map to home screen as main interface
- ✅ Implemented PWA configuration (manifest.json, service worker, app icons)
- ✅ Updated branding to SpotFree with custom logo throughout app
- ✅ Fixed query client to properly handle search parameters with URL query strings
- ✅ Resolved status report cache invalidation to refresh list, detail, and timeline views
- ✅ Synchronized follow state between frontend and backend with proper cache updates
- ✅ Added "Add Campground" feature with modal form accessible from home page and campground list
- ✅ Implemented three location input methods: click on map, enter address (with geocoding), or manual coordinates
- ✅ Added website URL field to campground schema for campground websites
- ✅ Integrated Google Geocoding API for address-to-coordinates conversion

## Project Architecture

### Technology Stack
- **Frontend:** React with TypeScript, Wouter for routing, TanStack Query for data fetching
- **Backend:** Express.js with TypeScript
- **Database:** Supabase/Neon PostgreSQL with Drizzle ORM
- **Authentication:** JWT tokens with bcrypt password hashing
- **Maps:** Google Maps JavaScript API via @vis.gl/react-google-maps
- **PWA:** Service worker, manifest.json, app icons for installability
- **Styling:** Tailwind CSS with custom teal outdoor theme
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
4. **Enhanced PWA:** Advanced offline caching with Workbox for full offline support

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/campgrounds` - List campgrounds (supports ?search= query)
- `GET /api/campgrounds/:id` - Campground details
- `POST /api/campgrounds` - Create new campground (requires auth)
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
