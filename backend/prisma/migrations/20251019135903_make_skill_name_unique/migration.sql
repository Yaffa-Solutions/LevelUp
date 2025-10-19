/*
  Warnings:

  - A unique constraint covering the columns `[skill_name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Skill_skill_name_key" ON "public"."Skill"("skill_name");
