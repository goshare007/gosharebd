# Admin Gallery Management System TODO

Here is a breakdown of the tasks to implement the admin gallery management system.

### 1. Database Schema (Prisma)

- [x] **Review `prisma/schema.prisma`:** The `GalleryImage` model and its relation to `Package` are already correctly defined.

```prisma
// prisma/schema.prisma

model Package {
  id          String         @id @default(cuid())
  // ... other package fields
  gallery     GalleryImage[]
}

model GalleryImage {
  id        String   @id @default(cuid())
  url       String
  publicId  String // This is crucial for deleting images from Cloudinary!
  package   Package  @relation(fields: [packageId], references: [id], onDelete: Cascade)
  packageId String
  createdAt DateTime @default(now())
}
```

### 2. API Routes for Gallery Management

- [ ] **Create API Route for Adding Images:**
    - **File:** `app/api/admin/packages/[packageId]/gallery/route.ts`
    - **Method:** `POST`
    - **Functionality:**
        - Admin authentication protection.
        - Accepts `imageUrl` and `publicId` in the request body (obtained from Cloudinary after upload).
        - Creates a new `GalleryImage` record in the database, associated with the `packageId`.

- [ ] **Create API Route for Deleting Images:**
    - **File:** `app/api/admin/packages/[packageId]/gallery/[imageId]/route.ts`
    - **Method:** `DELETE`
    - **Functionality:**
        - Admin authentication protection.
        - Uses `imageId` from the URL to find the `GalleryImage` record.
        - **Crucially:** Before deleting the database record, it should also delete the image from Cloudinary using the `publicId`.
        - Deletes the `GalleryImage` record from the database.

### 3. Frontend Components (Admin Dashboard)

- [ ] **Create `GalleryManagement.tsx` component:**
    - **Location:** `app/dashboard/admin/packages/[slug]/edit/` (or similar).
    - **Functionality:**
        - Fetches the gallery images for the current package.
        - Renders the `ImageUpload` and `GalleryImageList` components.

- [ ] **Create `ImageUpload.tsx` component:**
    - **Functionality:**
        - Provides a UI for uploading image files.
        - **Integrates with Cloudinary directly for upload.**
        - On successful upload to Cloudinary, it obtains the `imageUrl` and `publicId`.
        - Calls our new API endpoint (`/api/admin/packages/[packageId]/gallery`) to add these details to the package gallery.

- [ ] **Create `GalleryImageList.tsx` component:**
    - **Functionality:**
        - Receives the list of gallery images (including `publicId`) as a prop.
        - Renders the images.
        - Includes a "Delete" button for each image that calls the delete API endpoint (`/api/admin/packages/[packageId]/gallery/[imageId]`).
