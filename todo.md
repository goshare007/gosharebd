# TODO: Implement Dynamic Festivals Page (Revised Plan)

This plan outlines the steps to build the Festivals page by treating festival tours as a special category of the existing `Package` model.

### Phase 1: Update Data Model

- [x] **Modify the `Package` Model in Prisma**:
  - **File:** `prisma/schema.prisma`
  - **Actions:**
    1.  Create a new `enum PackageType { REGULAR, FESTIVAL }`.
    2.  Add a new field to the `Package` model: `packageType PackageType @default(REGULAR)`.
  - **Action:** Run `npx prisma migrate dev --name add_package_type` to apply the changes to the database.

### Phase 2: Backend API & Service Layer

- [x] **Create API Route for Festival Packages**:
  - **File:** `app/api/packages/festivals/route.ts`
  - **Action:** Create a `GET` endpoint that fetches all packages where `packageType` is `FESTIVAL`. This will power the public-facing Festivals page.

- [x] **Create Service Hook for Festival Packages**:
  - **File:** `services/packages.ts`
  - **Action:** Create a new `useFestivalPackages` hook. This `useQuery` hook will call the `/api/packages/festivals` endpoint.

### Phase 3: Admin UI Enhancements

- [ ] **Update "Add/Edit Package" Form**:
  - **Location:** The admin form component used for creating and updating packages.
  - **Action:** Add a `<Select>` or radio button group to the form, allowing the admin to set the `packageType` to either `REGULAR` or `FESTIVAL`.
  - **Action:** Ensure the `useAddPackage` and `useUpdatePackage` mutations correctly send this new `packageType` data to the backend.

- [ ] **Enhance Admin Packages Table (Optional)**:
  - **Location:** The admin page where all packages are listed (`/dashboard/admin/packages`).
  - **Action:** Add a column or a `Badge` to the table to show whether a package is `REGULAR` or `FESTIVAL`, making them easy to distinguish.

### Phase 4: Refactor Public Festivals Page

- [ ] **Connect Page to Live Data**:
  - **File:** `app/festivals/page.tsx`
  - **Actions:**
    1. Remove the hard-coded `UPCOMING` and `PAST` data arrays.
    2. Use the new `useFestivalPackages` hook to fetch live data.
    3. Adapt the components on the page (e.g., `FeaturedCard`, `FestivalCard`) to accept props based on the `Package` model's structure.
    4. Implement loading and error states for a better user experience.
