This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Prisma Schema Changes — Instructions

## Adding a New Model (Ongoing)

Once the migration history is set up, adding new models is simple:

**1. Update `schema.prisma`**
- Add the new model
- Add any back-relation fields to related models (e.g. `wishlists Wishlist[]` on `User`)

**2. Create and apply the migration**
```fish
bunx prisma migrate dev --name add_your_model_name
```

**3. Regenerate Prisma Client**
```fish
bunx prisma generate
```

That's it. Your DB and TypeScript types are now in sync.

---

## One-Time Baseline Setup (Already Done)

> This section documents what was done to establish migration history on an existing database.
> You do NOT need to repeat this unless migration history is lost or corrupted.

### The Problem
The database was created with `db push` (or similar) so Prisma had no migration history, causing drift errors on every `migrate dev` run.

### The Fix

**1. Remove any new/pending models from `schema.prisma` temporarily**
(e.g. remove the Wishlist model and its back-relations)

**2. Delete any existing migrations folder**
```fish
rm -rf prisma/migrations
```

**3. Clear Prisma's migration history from the DB**
```fish
echo 'DELETE FROM "_prisma_migrations";' | bunx prisma db execute --stdin
```

**4. Create the migrations folder and generate the baseline SQL**
```fish
mkdir -p prisma/migrations/0001_baseline

bunx prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script > prisma/migrations/0001_baseline/migration.sql
```

**5. Mark the baseline as already applied (do NOT run it — the DB already has these tables)**
```fish
bunx prisma migrate resolve --applied 0001_baseline
```

**6. Add your new models back to `schema.prisma`**

**7. Run the migration for the new models**
```fish
bunx prisma migrate dev --name add_your_model_name
```

**8. Regenerate Prisma Client**
```fish
bunx prisma generate
```

---

## Notes

- Always run `bunx prisma generate` after every migration to keep TypeScript types up to date.
- Use descriptive migration names: `add_wishlist`, `add_payment_model`, `add_index_to_bookings`, etc.
- Never manually edit a migration file after it has been applied — Prisma checksums them and will detect tampering.
- These commands use `bunx` instead of `npx` since the project uses Bun as the runtime.