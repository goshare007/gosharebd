# Project Optimization Plan

## Phase 1: Clean Up ✅ COMPLETED

### Removed
- Unused dependencies: `@base-ui/react`, `@tiptap/extension-bubble-menu`
- Unused devDependencies: `eslint`, `eslint-config-next`
- Unused file: `types/destination.ts`
- Unused config: `prisma.config.ts` (Next.js handles env vars)
- Unused exported types (10 types across services)

### Added
- Missing dependencies: `zod`, `postcss`

### Fixed
- Zod v4 syntax to v3 (z.email, z.date)

---

## Package Updates ✅ COMPLETED

Updated packages:
- Prisma: 7.4.0 → 7.5.0
- better-auth: 1.4.18 → 1.5.5
- lenis: 1.3.18-dev.0 → 1.3.18
- tailwindcss: 4.1.18 → 4.2.1
- @tailwindcss/postcss: 4.1.18 → 4.2.1
- shadcn: 3.8.4 → 3.8.5
- lucide-react: 0.563.0 → 0.577.0
- tailwind-merge: 3.4.0 → 3.5.0
- And other minor updates

Note: zod kept at 3.x (4.x has breaking changes)

---

---

## Phase 2: Performance ✅ COMPLETED

### Caching
- Added TanStack Query default staleTime (60s) and gcTime (5min)
- Added revalidate to public API routes:
  - `/api/packages/popular`: 60s
  - `/api/packages/all`: 60s
  - `/api/packages/single-package`: 60s
  - `/api/packages/single-package/departures`: 30s
  - `/api/festivals`: 60s
  - `/api/blog`: 60s
  - `/api/blog/categories`: 300s
  - `/api/gallery`: 300s
  - `/api/reviews/package/[slug]`: 30s

### Database (Prisma)
- Added indexes:
  - Package: isActive, packageType, isActive+packageType, division, isBestseller
  - Booking: status, userId+status

---

## Phase 3: Bundle Optimization

- [ ] Run build and analyze bundle size
- [ ] Lazy load heavy components (Tiptap, Carousel)
- [ ] Consider code splitting
