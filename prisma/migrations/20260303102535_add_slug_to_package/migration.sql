-- Step 1: Add slug as nullable first so existing rows don't break
ALTER TABLE "package" ADD COLUMN "slug" TEXT;

-- Step 2: Backfill existing rows using their id as a temporary unique slug
UPDATE "package" SET "slug" = id WHERE "slug" IS NULL;

-- Step 3: Now make it NOT NULL and UNIQUE
ALTER TABLE "package" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "package" ADD CONSTRAINT "package_slug_key" UNIQUE ("slug");