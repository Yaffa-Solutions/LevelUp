-- CreateTable
CREATE TABLE "JobSave" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobSave_talent_id_job_id_key" ON "JobSave"("talent_id", "job_id");

-- AddForeignKey
ALTER TABLE "JobSave" ADD CONSTRAINT "JobSave_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSave" ADD CONSTRAINT "JobSave_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
