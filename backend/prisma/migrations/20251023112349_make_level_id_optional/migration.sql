-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_level_id_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "level_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."UserLevels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
