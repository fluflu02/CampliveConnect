# SpotFree Design Guidelines

## Design Approach
**Reference-Based Design** drawing inspiration from outdoor/travel applications (Airbnb, AllTrails, Hipcamp) with emphasis on trust, community, and accessibility in outdoor environments.

**Key Principles:**
- Mobile-first for campers in the field
- High contrast for outdoor readability
- Trust signals for community-driven data
- Quick actions for on-the-go usage

## Color Palette

**Primary Colors:**
- Forest Green: 145 65% 35% (primary brand, trust, outdoor)
- Deep Teal: 180 50% 30% (accents, verified status)

**Status Colors:**
- Available/Free: 120 70% 45% (bright green)
- Full/Occupied: 0 75% 50% (alert red)
- Unknown/Unverified: 210 15% 60% (neutral gray-blue)
- Verified Badge: 200 90% 45% (trust blue)

**Dark Mode:**
- Background: 220 15% 12%
- Surface: 220 12% 18%
- Text Primary: 0 0% 95%

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 220 15% 20%

## Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - clean, readable
- Display: 'Outfit' (Google Fonts) - headers, bold statements

**Scale:**
- Hero: text-5xl to text-6xl, font-bold
- Headings: text-2xl to text-4xl, font-semibold
- Body: text-base, font-normal
- Captions: text-sm, font-medium
- Labels: text-xs, uppercase, tracking-wide

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Tight spacing: p-2, gap-2 (status badges, chips)
- Standard: p-4, gap-4 (cards, list items)
- Generous: p-8, gap-8 (sections, containers)

**Containers:**
- Mobile: px-4
- Desktop: max-w-7xl, mx-auto, px-6

## Core Components

### Map Interface
- Full-screen map view with floating controls
- Cluster markers showing campground availability
- Color-coded pins: green (available), red (full), gray (unknown)
- Info cards slide up from bottom on mobile, sidebar on desktop
- Current location button (bottom-right)
- Filter/search bar (top, translucent with backdrop blur)

### Campground Cards
- Image header (16:9 ratio) with overlay status badge
- Title, location, last updated time
- Community trust indicators (report count, verified checkmark)
- Quick follow button (heart icon)
- Latest status with visual indicator dot

### Status Reports
- Timeline view with user avatars
- Time-stamped entries (e.g., "2h ago")
- Status pills with icons (tent for available, X for full)
- Verification badge for owner overrides
- Report submission: bottom sheet modal with 3 large status buttons

### Navigation
- Bottom tab bar (mobile): Map, List, Following, Profile
- Top navigation (desktop): Logo left, search center, user menu right
- Floating action button for quick report (mobile)

### Owner Dashboard
- Card-based layout for stats (followers, reports, subscription)
- Override status control: toggle switch with expiry picker
- Push notification composer: text field with character count
- Subscription card with Stripe portal link

### Admin Panel
- Table view for pending claims with approve/reject actions
- User role badges (camper, owner, admin)
- Moderation queue with report details

## Animations
Use sparingly for feedback only:
- Status badge pulse on live updates (subtle)
- Card transitions (slide up/fade in)
- Button press states (scale 0.98)
- Loading states (skeleton screens, not spinners)

## Images

**Hero Section (Landing Page):**
Large hero image featuring scenic campground at golden hour with tents/RVs visible, showing community and outdoor lifestyle. Overlay with semi-transparent gradient (bottom to top) for text readability.

**Campground Cards:**
Each card includes a representative image (if available, otherwise placeholder illustration of tent/campsite in brand colors)

**Empty States:**
Custom illustrations matching brand colors (forest green/teal) showing camping scenes

**Owner/Admin Sections:**
Dashboard-focused, minimal imagery, rely on data visualization and status indicators

## Progressive Web App Elements
- Install prompt banner (dismissible, shows after 3 visits)
- Offline indicator (top banner, yellow background)
- App icon: simplified tent/mountain logo on forest green
- Splash screen: brand logo centered on white/dark background