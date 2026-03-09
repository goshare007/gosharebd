-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('REGULAR', 'FESTIVAL');

-- AlterTable
ALTER TABLE "package" ADD COLUMN     "packageType" "PackageType" NOT NULL DEFAULT 'REGULAR';
