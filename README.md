# GoShareBD - Tour & Travel Platform

A Next.js 16 + TypeScript + Prisma + PostgreSQL travel booking platform built with Shadcn UI.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth
- **UI**: Shadcn UI + Tailwind CSS
- **State**: TanStack Query
- **Runtime**: Bun

## Getting Started

```bash
# Install dependencies
bun install

# Generate Prisma client
bunx prisma generate

# Run development server
bun run dev
```

## Project Structure

```
gosharebd/
├── app/                        # Next.js App Router pages
│   ├── api/                    # API routes (Backend)
│   │   ├── auth/              # Authentication endpoints
│   │   ├── bookings/          # Booking API
│   │   ├── packages/          # Package API
│   │   ├── destinations/      # Destination API
│   │   ├── user/              # User-specific API
│   │   ├── dashboard/         # Dashboard stats API
│   │   ├── admin/             # General admin API
│   │   ├── gallery/
│   │   └── subscribe/
│   │
│   ├── (public)/              # Public-facing routes (conceptual)
│   │   ├── page.tsx           # Homepage
│   │   ├── packages/          # Package listing
│   │   ├── book/              # Booking flow
│   │   ├── blog/
│   │   ├── gallery/
│   │   ├── festivals/
│   │   └── sign-in/
│   │
│   ├── dashboard/             # Protected dashboard routes
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   ├── account/           # Account management
│   │   ├── bookings/          # User bookings
│   │   ├── wishlist/
│   │   ├── my-reviews/
│   │   ├── notifications/
│   │   ├── admin/             # Admin section
│   │   │   ├── bookings/
│   │   │   ├── packages/
│   │   │   ├── destinations/
│   │   │   ├── users/
│   │   │   └── gallery/
│   │   ├── page.tsx           # User dashboard
│   │   ├── user-dashboard.tsx
│   │   └── admin-dashboard.tsx
│   │
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles
│   ├── not-found.tsx          # 404 page
│   ├── robots.ts              # Robots.txt
│   └── sitemap.ts             # Sitemap
│
├── components/                # React components
│   ├── ui/                   # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/               # Layout components
│   │   ├── header/           # Header components
│   │   │   ├── header.tsx
│   │   │   ├── user.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── logout.tsx
│   │   ├── footer/           # Footer components
│   │   │   ├── footer.tsx
│   │   │   └── newsletter.tsx
│   │   └── sidebar/          # Sidebar components
│   │       ├── app-sidebar.tsx
│   │       ├── nav-main.tsx
│   │       ├── nav-user.tsx
│   │       └── breadcrumb-component.tsx
│   ├── landing/              # Landing page components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── PopularDestinations.tsx
│   │   ├── Testimonials.tsx
│   │   └── Cta.tsx
│   └── common/               # Shared components
│       └── share.tsx
│
├── lib/                      # Utility libraries
│   ├── auth.ts               # Better Auth configuration
│   ├── auth-client.ts         # Client-side auth helpers
│   ├── auth-utils.ts         # Auth utility functions
│   ├── prisma.ts             # Prisma client instance
│   └── utils.ts              # General utilities (cn, etc.)
│
├── services/                 # API service functions (React Query)
│   ├── booking.ts            # Booking mutations/queries
│   ├── packages.ts           # Package mutations/queries
│   ├── destinations.ts       # Destination mutations/queries
│   ├── departure.ts         # Departure mutations/queries
│   ├── gallery.ts            # Gallery mutations/queries
│   ├── subscribe.ts          # Subscribe mutations
│   ├── dashboard.ts          # Dashboard stats queries
│   ├── wishlist.ts           # Wishlist mutations/queries
│   └── admin-users.ts        # Admin user management
│
├── types/                    # TypeScript type definitions
│   ├── package.ts            # Package-related types
│   ├── booking.ts            # Booking-related types
│   ├── destination.ts        # Destination types
│   ├── gallery.ts            # Gallery types
│   ├── wishlist.ts           # Wishlist types
│   ├── dashboard.ts          # Dashboard stats types
│   └── bookings.ts           # Additional booking types
│
├── context/                  # React context providers
│   ├── theme-provider.tsx    # Dark mode theme
│   ├── tanstack-query-provider.tsx
│   └── lenis-provider.tsx    # Smooth scrolling (Lenis)
│
├── hooks/                    # Custom React hooks
│   └── use-mobile.ts        # Mobile detection hook
│
├── cloudinary/              # Cloudinary configuration
│   ├── config.ts
│   └── index.ts
│
├── prisma/                   # Database schema
│   └── schema.prisma
│
├── constants/               # App constants
│   └── query-keys.ts        # TanStack Query keys
│
├── public/                  # Static assets
│   ├── favicon.ico
│   └── ...
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── biome.json
└── prisma.config.ts
```

## Recommended Folder Structure Improvements

The following improvements are recommended for better organization but not yet implemented:

### 1. Use Route Groups

Group routes using Next.js route groups `(folder)`:

```
app/
├── (public)/                # Public routes (no URL change)
│   ├── packages/
│   ├── book/
│   └── ...
├── (dashboard)/             # Protected routes (no URL change)
│   ├── admin/
│   └── ...
```

### 2. Consolidate API Routes

Current inconsistent patterns:
- `app/api/admin/users/` 
- `app/api/packages/admin/packages/`

Should be standardized to:
- `app/api/admin/users/`
- `app/api/packages/admin/`

### 3. Group Services by Feature

Consider creating subdirectories in `services/`:
```
services/
├── admin/
│   ├── users.ts
│   └── bookings.ts
├── user/
│   ├── bookings.ts
│   └── wishlist.ts
└── public/
    ├── packages.ts
    └── destinations.ts
```

---

## Key Conventions

### API Routes

- `app/api/[resource]/` - Public or general endpoints
- `app/api/[resource]/admin/` - Admin-only endpoints
- `app/api/[resource]/my-[resource]/` - User-specific endpoints

### Components

- `components/ui/` - Shadcn UI components (don't modify directly)
- `components/layout/` - Layout shell components  
- `components/landing/` - Page-specific components
- `components/common/` - Reusable components across pages

### Services

All API calls go through React Query hooks in the `services/` folder. Each service file corresponds to a major feature area.

---

## Prisma Schema Changes

### Adding a New Model

**1. Update `prisma/schema.prisma`**
- Add the new model
- Add any back-relation fields to related models

**2. Create and apply the migration**
```bash
bunx prisma migrate dev --name add_your_model_name
```

**3. Regenerate Prisma Client**
```bash
bunx prisma generate
```

### Database Migration (One-time Setup)

If migration history is lost or corrupted:

```bash
# 1. Remove new models from schema.prisma temporarily
# 2. Delete existing migrations
rm -rf prisma/migrations

# 3. Clear Prisma's migration history
echo 'DELETE FROM "_prisma_migrations";' | bunx prisma db execute --stdin

# 4. Create baseline
mkdir -p prisma/migrations/0001_baseline
bunx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > prisma/migrations/0001_baseline/migration.sql

# 5. Mark as applied
bunx prisma migrate resolve --applied 0001_baseline

# 6. Add models back and migrate
bunx prisma migrate dev --name add_your_model_name
bunx prisma generate
```

---

## Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run Biome linter
bun run format       # Format code with Biome
bun run check        # Lint + format + type check
```
