# Blog System Implementation Plan

This document outlines the steps to build the blog system on top of the existing Prisma schema.
All tasks are ordered so each step unblocks the next.

---

## Phase 1 — Categories (must be first, unblocks post creation)

### API
- [ ] `GET  /api/admin/blog/categories` — fetch all categories (for the post form select)
- [ ] `POST /api/admin/blog/categories` — create a new `BlogCategory`. Requires admin role.
- [ ] `PUT  /api/admin/blog/categories/[id]` — update name/slug/description. Requires admin role.
- [ ] `DELETE /api/admin/blog/categories/[id]` — delete a category. Requires admin role.

### Admin UI
- [ ] Create page at `/dashboard/admin/blog/categories`
- [ ] Display table of all categories with Edit and Delete actions
- [ ] Inline form or modal to create/edit a category
- [ ] Auto-generate `slug` from `name` on create, lock it on edit (manual override allowed)

---

## Phase 2 — Image Upload Endpoint

- [ ] Create `POST /api/admin/blog/image-upload`. Requires admin role.
  1. Receive the image file from the TipTap editor or cover image picker
  2. Upload to Cloudinary using the existing configuration
  3. Save a `BlogImage` record with `url`, `publicId`, and **nullable** `postId`
     - `postId` is null when the post does not exist yet (new post flow)
     - `postId` is linked after the post is saved (see Phase 3)
  4. Return `{ url, publicId }` to the caller

- [ ] Add a cleanup job (cron or on-demand) to delete `BlogImage` rows where `postId IS NULL`
  and `createdAt < now() - 24h`, and call the Cloudinary delete API for each.

> **Why nullable postId:** When creating a new post there is no ID yet.
> Images are uploaded immediately on insert into the editor, so they must be
> stored before the post is saved.

---

## Phase 3 — Post CRUD API

### Routes
- [ ] `GET    /api/blog` — fetch paginated published posts (public)
  - Query params: `?page=1&limit=10&category=slug&tag=name`
  - Returns: posts with `author.name`, `author.image`, `category.name`, `coverImage`, `excerpt`, `publishedAt`
  - Only returns `status = PUBLISHED`

- [ ] `GET    /api/blog/[slug]` — fetch single published post by slug (public)
  - Increments `viewCount` atomically:
    ```ts
    await prisma.$executeRaw`UPDATE blog_post SET "viewCount" = "viewCount" + 1 WHERE id = ${post.id}`
    ```
  - Do **not** use `prisma.blogPost.update` — it is not atomic

- [ ] `GET    /api/admin/blog` — fetch all posts including drafts (admin)
  - Supports `?status=DRAFT|PUBLISHED|ARCHIVED` filter
  - Returns all fields including `viewCount`, `status`, `featured`

- [ ] `GET    /api/admin/blog/[id]` — fetch single post by ID for the edit form (admin)

- [ ] `POST   /api/admin/blog` — create a new post (admin)
  - Auto-generate `slug` from `title` server-side (e.g. `slugify(title)`)
  - Set `publishedAt: new Date()` if `status === PUBLISHED`, otherwise `null`
  - After saving, link any uploaded `BlogImage` rows that match by updating `postId`

- [ ] `PUT    /api/admin/blog/[id]` — update an existing post (admin)
  - **Never** auto-regenerate the slug — only update it if explicitly provided
  - If status changes from non-PUBLISHED → PUBLISHED and `publishedAt` is null,
    set `publishedAt: new Date()` server-side. Do not accept `publishedAt` from the client.
  - On save, link any orphaned `BlogImage` rows (postId = null) created during this edit session

- [ ] `DELETE /api/admin/blog/[id]` — delete a post (admin)
  - `BlogImage` rows are removed automatically via `onDelete: Cascade`
  - After deletion, call Cloudinary's delete API for each `publicId` that was on the post
  - Also delete `coverImageId` and `metaImageId` from Cloudinary

### Authorization
- [ ] All `/api/admin/blog/*` routes must verify `session.user.role === 'admin'`
- [ ] Return `403` immediately if the check fails

---

## Phase 4 — Admin Post Form

- [ ] Create page at `/dashboard/admin/blog/new` and `/dashboard/admin/blog/[id]/edit`

### Form fields
| Field | Behaviour |
|---|---|
| `title` | Plain text input |
| `slug` | Auto-generated from title on **create only**, locked on edit. Show manual override field. |
| `excerpt` | Textarea — written by editor, not auto-truncated |
| `content` | TipTap editor (see below) |
| `coverImage` | Cloudinary upload picker — stores `coverImage` URL + `coverImageId` |
| `metaImage` | Optional Cloudinary upload — OG/Twitter card image, falls back to coverImage |
| `categoryId` | Select populated from `GET /api/admin/blog/categories` |
| `tags` | Tag input (comma separated or chip input) |
| `status` | Select: `DRAFT` / `PUBLISHED` / `ARCHIVED` |
| `featured` | Toggle/checkbox |
| `metaTitle` | Optional SEO override for title |
| `metaDescription` | Optional SEO override for excerpt |

### TipTap editor setup
- [ ] Install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`
- [ ] Configure the Image extension to POST to `/api/admin/blog/image-upload` on file drop or toolbar insert
- [ ] Save editor state as JSON (`editor.getJSON()`) — this is the value stored in `BlogPost.content`
- [ ] On load (edit form), initialise editor with `editor.setContent(JSON.parse(post.content))`

---

## Phase 5 — Admin Blog Management Page

- [ ] Create page at `/dashboard/admin/blog`
- [ ] Fetch all posts from `GET /api/admin/blog`
- [ ] Display a table with columns: Title, Category, Status, Featured, Views, Author, Created At
- [ ] Status shown as a coloured badge (`DRAFT` = muted, `PUBLISHED` = green, `ARCHIVED` = orange)
- [ ] Action buttons per row: Edit (→ `/dashboard/admin/blog/[id]/edit`), Delete (confirmation dialog)
- [ ] "Create New Post" button → `/dashboard/admin/blog/new`
- [ ] Filter bar: filter by `status` and `category`

---

## Phase 6 — Public Blog Listing Page

- [ ] Create or enhance `/app/blog/page.tsx`
- [ ] Fetch from `GET /api/blog?page=1&limit=10`
- [ ] Display post cards with: `coverImage`, `title`, `excerpt`, `category.name`, `author.name`, `author.image`, `publishedAt`
- [ ] Implement pagination controls (page-based or load-more)
- [ ] Show a featured post hero at the top if any post has `featured: true`
- [ ] Filter by category via query param `?category=slug`
- [ ] Filter by tag via query param `?tag=name`

---

## Phase 7 — Public Single Post Page

- [ ] Create `/app/blog/[slug]/page.tsx`
- [ ] Fetch from `GET /api/blog/[slug]`
- [ ] Display: `title`, `coverImage`, `author.name`, `author.image`, `publishedAt`, `category.name`, `tags`
- [ ] **Render TipTap JSON content:**
  ```ts
  import { generateHTML } from '@tiptap/html'
  import StarterKit from '@tiptap/starter-kit'
  import Image from '@tiptap/extension-image'

  const html = generateHTML(JSON.parse(post.content), [StarterKit, Image])
  ```
  Render the output with `dangerouslySetInnerHTML` — sanitize with `isomorphic-dompurify` first.
- [ ] Add OG meta tags using `metaTitle`, `metaDescription`, `metaImage` (fallback to `coverImage`)
- [ ] Show related posts (same category, exclude current)

---

## Phase 8 — Categories & Tag Filtering (completes the public UI)

- [ ] Public `GET /api/blog/categories` — list all categories with post counts
- [ ] Category page at `/blog/category/[slug]` — filtered listing
- [ ] Tag page at `/blog/tag/[tag]` — filtered listing
- [ ] Breadcrumb navigation on post and category pages

---

## Key Rules & Decisions (reference throughout)

| Topic | Decision |
|---|---|
| Content format | TipTap `JSONContent` stringified — never raw HTML |
| Slug on create | Auto-generated from title via `slugify()` |
| Slug on edit | Locked — only updated if editor explicitly changes it |
| `publishedAt` | Set server-side on first publish, never accepted from client |
| View count | `$executeRaw` atomic increment — never `blogPost.update` |
| Image upload | Always nullable `postId` on upload, linked after post save |
| Cloudinary cleanup | On post delete: cascade DB rows + call Cloudinary delete API per `publicId` |
| OG image | `metaImage` if set, fallback to `coverImage` |
| Content sanitization | Run `generateHTML` output through `isomorphic-dompurify` before rendering |
| Admin auth | Check `session.user.role === 'admin'` in every `/api/admin/*` handler |