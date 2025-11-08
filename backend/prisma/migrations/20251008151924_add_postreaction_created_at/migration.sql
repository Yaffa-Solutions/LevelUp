/*
  Warnings:

  - A unique constraint covering the columns `[user_id,post_id]` on the table `PostReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PostReaction" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_user_id_post_id_key" ON "PostReaction"("user_id", "post_id");
