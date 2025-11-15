/*
  Warnings:

  - You are about to drop the column `cv_url` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experience" ALTER COLUMN "end_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cv_url";
