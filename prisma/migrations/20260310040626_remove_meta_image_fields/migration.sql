/*
  Warnings:

  - You are about to drop the column `metaImage` on the `blog_post` table. All the data in the column will be lost.
  - You are about to drop the column `metaImageId` on the `blog_post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blog_post" DROP COLUMN "metaImage",
DROP COLUMN "metaImageId";
