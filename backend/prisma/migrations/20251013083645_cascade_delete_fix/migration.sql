-- DropForeignKey
ALTER TABLE "public"."Experience" DROP CONSTRAINT "Experience_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Job" DROP CONSTRAINT "Job_hunter_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobApplication" DROP CONSTRAINT "JobApplication_job_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobApplication" DROP CONSTRAINT "JobApplication_talent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Plan" DROP CONSTRAINT "Plan_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PostReaction" DROP CONSTRAINT "PostReaction_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PostReaction" DROP CONSTRAINT "PostReaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SkillTalent" DROP CONSTRAINT "SkillTalent_skill_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SkillTalent" DROP CONSTRAINT "SkillTalent_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_hunter_id_fkey" FOREIGN KEY ("hunter_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillTalent" ADD CONSTRAINT "SkillTalent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillTalent" ADD CONSTRAINT "SkillTalent_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
