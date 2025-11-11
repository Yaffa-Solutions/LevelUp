-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_user2_id_fkey";

-- AlterTable
ALTER TABLE "public"."Chat" ALTER COLUMN "user2_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
