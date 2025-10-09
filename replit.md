# SpotFree - Real-Time Campground Availability Tracker

## Overview
SpotFree is a progressive web app that provides real-time campground availability through community reporting and owner verification. The platform supports multiple user roles (campers, owners, admins) with features including push notifications, Stripe subscriptions, and comprehensive moderation tools.

**Current Status:** Core functionality complete with Google Maps integration and PWA support. The app is centered on Engadin, Switzerland region with interactive map on the home screen.

## Recent Changes (October 9, 2025)
- ✅ **Instant Claim System** - Simplified campground ownership workflow
  - One-click claim process - no admin approval required
  - Immediate role upgrade to "owner" upon claiming
  - Instant access to all owner features (forecasts, announcements, etc.)
  - Automatic campground verification and ownership linking
  - Verified owner badge appears immediately after claiming

## Earlier Changes (October 6, 2025)
- ✅ **Owner Dashboard** - Complete management interface for verified owners
  - Forecast Manager: Set 7-day availability forecasts for all vehicle/tent types
  - Announcement Creator: Post updates and events with optional push notifications
  - Follower tracking: View follower counts for owned campgrounds
  - Multi-campground support: Manage multiple verified campgrounds
- ✅ **Verified Owner Badges** - Visual trust indicators
  - Checkmark badges on campground detail page headers
  - Mini badges on map markers for verified campgrounds
  - Badge displayed in hover tooltips on map
- ✅ **Database Schema Extensions**
  - availabilityForecasts table: 7-day forecast data per vehicle/tent type
  - announcements table: Owner updates with notification flag
  - notificationsEnabled field in users table
  - notifyOnAvailability field in follows table
  - isVerifiedOwner field in campgrounds table
  - ownerEmail and verificationCode fields in claims table
- ✅ **API Routes** - New endpoints for owner features
  - POST /api/forecasts - Create/update availability forecasts
  - GET /api/forecasts/:campgroundId - Retrieve forecasts
  - POST /api/announcements - Create announcements
  - GET /api/announcements/:campgroundId - Retrieve announcements
  - PATCH /api/user/notifications - Update notification preferences
  - GET /api/owner/campgrounds - Owner's verified campgrounds with stats

## Earlier Changes (October 3, 2025)
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

## Owner Features Implementation
### Completed
1. ✅ **Owner Dashboard** (`/owner/dashboard`) - Comprehensive management interface
   - Tabbed interface for forecasts and announcements
   - Real-time follower count display
   - Multi-campground selection and management
2. ✅ **Forecast Manager** - 7-day availability predictions
   - Input fields for all 5 vehicle/tent types (motorhome, caravan, VW bus, large tent, small tent)
   - Date-based forecast editing (next 7 days)
   - Batch save functionality
3. ✅ **Announcement System** - Owner-to-follower communication
   - Title and message input
   - Optional push notification flag
   - Recent announcements history display
4. ✅ **Instant Claim Workflow** - Self-service ownership
   - "Claim as Owner" button on any campground detail page
   - Email and optional proof of ownership fields
   - Instant approval and owner access (no admin review needed)
   - Automatic role upgrade and campground verification
5. ✅ **Verified Badges** - Trust indicators across the app
   - Map marker overlays with checkmark icons
   - Detail page header badges
   - Hover tooltip indicators

## Pending Features
1. **Stripe Integration:** Checkout flow and webhook handling for Pro subscriptions
2. **Push Notifications:** Firebase Cloud Messaging implementation for follower alerts
3. **Enhanced PWA:** Advanced offline caching with Workbox for full offline support
4. **Owner Status Overrides:** Real-time availability override UI (current forecasts are for predictions)

## API Endpoints
### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user info

### Campgrounds
- `GET /api/campgrounds` - List campgrounds (supports ?search= query)
- `GET /api/campgrounds/:id` - Campground details
- `POST /api/campgrounds` - Create new campground (requires auth)
- `GET /api/campgrounds/:id/reports` - Status report timeline

### Status Reports
- `POST /api/reports` - Submit status report (requires auth)

### Following
- `POST /api/follow` - Follow campground (requires auth)
- `DELETE /api/follow/:campgroundId` - Unfollow campground (requires auth)
- `GET /api/follows` - User's followed campground IDs (requires auth)

### Claims (Ownership)
- `POST /api/claims` - Submit ownership claim and get instant owner access (requires auth)
- `GET /api/admin/claims` - List all claims for record-keeping (admin only)

### Forecasts (Owner only)
- `POST /api/forecasts` - Create/update availability forecast (owner only)
- `GET /api/forecasts/:campgroundId` - Get forecasts for campground (public)

### Announcements
- `POST /api/announcements` - Create announcement (owner only)
- `GET /api/announcements/:campgroundId` - Get announcements (public)

### User Preferences
- `PATCH /api/user/notifications` - Update notification preferences (requires auth)

### Owner Dashboard
- `GET /api/owner/campgrounds` - Get owned campgrounds with stats (owner only)

## Security Notes
- JWT tokens stored in localStorage with AuthProvider context
- Protected routes check authentication before rendering
- Server middleware validates tokens and enforces role permissions
- Passwords hashed with bcrypt before storage
- Development database only - production database not accessible via tools
