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

## Phase 2: Performance

### Database (Prisma)
- [ ] Add indexes to frequently queried columns
- [ ] Review query patterns for N+1 issues

### Images
- [ ] Implement next/image with Cloudinary loader
- [ ] Add blur placeholders

### Rendering
- [ ] Add RSC for static pages
- [ ] Add `dynamic = 'force-static'` for appropriate pages

### Caching
- [ ] Add revalidate periods to fetch calls
- [ ] Configure TanStack Query staleTime

---

## Phase 3: Bundle Optimization

- [ ] Run build and analyze bundle size
- [ ] Lazy load heavy components (Tiptap, Carousel)
- [ ] Consider code splitting
