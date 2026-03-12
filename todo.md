# Project Optimization Plan

## Phase 1: Clean Up (Based on Knip Report)

### Remove Unused Files
- [x] `types/destination.ts` - unused file

### Remove Unused Dependencies
- [x] `@base-ui/react` - not being used
- [x] `@tiptap/extension-bubble-menu` - not being used

### Remove Unused DevDependencies
- [x] `eslint` - not needed (using biome)
- [x] `eslint-config-next` - not needed

### Add Missing Dependencies
- [x] Add `zod` to package.json (16 files use it but it's not listed)
- [x] Add `postcss` to dependencies (postcss.config.mjs exists)

### Fix Imports
- [x] `dotenv/config` in `prisma.config.ts` - removed prisma.config.ts (Next.js handles env vars)

### Fix Unused Exports (Consider removing or using)
- [x] Review and clean up unused exports in:
  - `components/reviews/index.ts` - ReviewCard, ReviewForm, ReviewStats, StarRating
  - `components/ui/*` - many shadcn unused exports (these are normal - shadcn exports all components)
  - `lib/help.ts` - getAllArticles function
  - `services/gallery.ts` - useSinglePackageImages
  - `services/packages.ts` - useFestivalPackages
  - `services/wishlist.ts` - useToggleWishlist
  - `context/lenis-provider.tsx` - useLenis
- [x] Remove unused exported types:
  - `Session` from lib/auth-client.ts
  - `ArticleMeta` from lib/help.ts
  - `UsersResponse` from services/admin-users.ts
  - `UsersParams` from services/admin-users.ts
  - `BlogPostListItem` from services/blog.ts
  - `DeparturePackage` from services/departure.ts
  - `DeparturesResponse` from services/departure.ts
  - `CreateSinglePayload` from services/departure.ts
  - `CreateBulkPayload` from services/departure.ts
  - `UpdateDeparturePayload` from services/departure.ts

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
