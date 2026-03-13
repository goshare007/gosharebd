# GoShareBD - Tour & Travel Platform

A full-featured tour and travel booking platform built with modern technologies.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL with Prisma ORM |
| Auth | Better Auth |
| UI | Shadcn UI + Tailwind CSS |
| State | TanStack Query |
| Runtime | Bun |

## Features

- **User Authentication** - Secure login/signup with Better Auth
- **Package Browsing** - Browse tour packages with filtering and search
- **Booking System** - Complete booking flow with payment integration
- **Wishlist** - Save favorite packages
- **Reviews & Ratings** - User reviews for packages
- **Admin Dashboard** - Full admin panel for managing:
  - Packages (CRUD)
  - Destinations
  - Bookings
  - Users
  - Gallery images
  - Blog content

## Prerequisites

- [Bun](https://bun.sh) - JavaScript runtime
- [PostgreSQL](https://postgresql.org) - Database

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/sejarparvez/gosharebd.git
cd gosharebd
bun install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gosharebd?schema=public"

# Auth
BETTER_AUTH_SECRET="your-secret-key-min-32-chars-long-here"
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Database Setup

```bash
# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate dev --name init

# (Optional) Seed the database
bunx prisma db seed
```

### 4. Start Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run Biome linter |
| `bun run format` | Format code with Biome |
| `bun run check` | Lint + format + type check |

## Database

### Prisma Commands

```bash
# Create new migration
bunx prisma migrate dev --name migration_name

# Apply migrations (production)
bunx prisma migrate deploy

# Reset database
bunx prisma migrate reset

# Generate Prisma client
bunx prisma generate

# Open Prisma Studio (database GUI)
bunx prisma studio
```

### Schema Overview

The database includes these main models:
- **User** - User accounts with roles (USER, ADMIN)
- **Package** - Tour packages with details, pricing, availability
- **Destination** - Travel destinations
- **Booking** - User bookings with status tracking
- **Departure** - Package departure dates
- **Gallery** - Package images
- **Wishlist** - Saved packages
- **Review** - User reviews and ratings
- **Blog** - Blog posts and categories

## Project Structure

```
gosharebd/
├── app/                        # Next.js App Router
│   ├── api/                    # API routes
│   │   ├── admin/             # Admin endpoints
│   │   ├── bookings/          # Booking API
│   │   ├── packages/          # Package API
│   │   ├── destinations/      # Destination API
│   │   ├── gallery/
│   │   └── ...
│   ├── dashboard/             # Protected routes
│   │   ├── admin/             # Admin dashboard
│   │   └── ...                # User dashboard
│   └── (public)/              # Public pages
│
├── components/                # React components
│   ├── ui/                   # Shadcn UI components
│   ├── layout/               # Header, Footer, Sidebar
│   └── landing/              # Landing page components
│
├── lib/                       # Core utilities
│   ├── auth.ts               # Better Auth config
│   ├── prisma.ts             # Prisma client
│   └── utils.ts              # Helper functions
│
├── services/                 # TanStack Query hooks
│   ├── packages.ts           # Package API calls
│   ├── booking.ts            # Booking API calls
│   └── ...
│
├── types/                    # TypeScript definitions
├── context/                  # React context providers
├── constants/               # App constants
└── prisma/                  # Database schema
```

## Key Conventions

### API Routes

```
app/api/
├── [resource]/              # Public endpoints
├── [resource]/admin/        # Admin-only endpoints
└── [resource]/my-[resource]/ # User-specific endpoints
```

### Query Keys (TanStack Query)

All query keys are defined in `constants/query-keys.ts`:
- `QUERY_KEYS.ALL_PACKAGES` - List all packages
- `QUERY_KEYS.SINGLE_PACKAGES` - Single package details
- `QUERY_KEYS.ADMIN_PACKAGES_WITH_GALLERY` - Admin package list with gallery
- etc.

### Component Organization

- `components/ui/` - Shadcn UI (don't modify directly)
- `components/layout/` - Layout shell components
- `components/landing/` - Page-specific components
- `components/common/` - Shared reusable components

## Deployment

### Build for Production

```bash
bun run build
bun run start
```

### Environment Variables (Production)

Set these in your deployment platform:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret (generate with: `bun run --bun -e "console.log(crypto.randomUUID())"`)
- `BETTER_AUTH_URL` - Production URL
- Cloudinary credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run lint and type check:
   ```bash
   bun run check
   ```
5. Commit and push

## License

MIT License
