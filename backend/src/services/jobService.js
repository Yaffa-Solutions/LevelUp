const { PrismaClient, Prisma   } = require('../generated/prisma');
const prisma = new PrismaClient();
const { safeRedisGet, safeRedisSetEx} = require('./redisSafe');

const getRecommendedJobs = async (userId) => {
  if (!userId) throw new Error('userId is required');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { levels: true } 
  });

  if (!user) throw new Error('User not found');

  const userLevelName = user.levels.name; 

  const jobs = await prisma.job.findMany({
    where: {
      meta_data: {
        path: ['level_name'],
        equals: userLevelName
      }
    }
  });

  return jobs;
};

const getAvailableJobs = async () => {
  const cachedData = await safeRedisGet('available_jobs');
  if (cachedData) return JSON.parse(cachedData);

  const jobs = await prisma.job.findMany();
  const levels = await prisma.userLevels.findMany();

  const result = jobs.map((job) => {
    const levelId = job.meta_data?.level_id;
    const level = levels.find(l => l.id === levelId);
    return {
      ...job,
      meta_data: {
        ...job.meta_data,
        level_name: level ? level.name : job.meta_data?.level_name || null
      }
    };
  });
  await safeRedisSetEx('available_jobs', 120,JSON.stringify(result));
   console.log("✅ available_jobs cached in Redis");
  return result;
};


const getJobDetails = async (jobId) => {
  const cached = await safeRedisGet(`job_${jobId}`);
  if (cached) return JSON.parse(cached);

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return null;

  if (!job.meta_data?.level_name && job.meta_data?.level_id) {
    const level = await prisma.userLevels.findUnique({
      where: { id: job.meta_data.level_id }
    });
    job.meta_data = {
      ...job.meta_data,
      level_name: level ? level.name : null
    }

  await safeRedisSetEx(`job_${jobId}`, 300, JSON.stringify(job));
  return job;
  }

  return job;
};



const applyJob = async (jobId, userId) => {
  if (!jobId || !userId) throw new Error("User ID missing");

  const exists = await prisma.jobApplication.findFirst({
    where: { job_id: jobId, talent_id: userId }
  });

  if (exists) throw new Error("Already applied");

  return prisma.jobApplication.create({
    data: {
      job_id: jobId ,
      talent_id: userId ,
      // status: Prisma.Status.ACCEPTED 
      status: 'ACCEPTED'
    }
  });
};
const unapplyJob = async (jobId, userId) => {
  const application = await prisma.jobApplication.findFirst({
    where: { job_id: jobId, talent_id: userId }
  });

  if (!application) throw new Error('Application not found');

  await prisma.jobApplication.delete({
    where: { id: application.id }
  });


  return { id: application.id, jobId, talentId: userId };
};

const saveJob = async (userId, jobId) => {
  console.log('Saving job:', { userId, jobId });
  const exists = await prisma.jobSave.findFirst({
    where: { job_id: jobId, talent_id: userId }
  });
  if (exists) throw new Error('Already saved');

  return prisma.jobSave.create({
    data: {
      job_id: jobId,
      talent_id: userId
    }
  });
};

const unsaveJob = async (userId, jobId) => {
  const saved = await prisma.jobSave.findFirst({
    where: { job_id: jobId, talent_id: userId }
  });

  if (!saved) throw new Error('Job not saved');

  await prisma.jobSave.delete({
    where: { id: saved.id }
  });

  return { message: 'Job unsaved successfully' };
};


const getSavedJobs = async (userId) => {
  return prisma.jobSave.findMany({
    where: { talent_id: userId },
    include: { job: true }
  });
};
const getJobSave = async (userId, jobId) => {
  return prisma.jobSave.findFirst({
    where: { talent_id: userId, job_id: jobId }
  });
};

const getHunterJobs = async (hunterId) => {
  const jobs = await prisma.job.findMany({
    where: { hunter_id: hunterId },
    include: { jobApplications: true }
  });

  return jobs.map((j) => ({
    ...j,
    applicantsCount: j.jobApplications.length
  }));
};

const createJob = async (hunterId, data) => {
  const meta = {
    title: data.title,
    description: data.description,
    level_id: data.level?.id || data.level_id, 
    level_name: data.level?.name || data.level_name,
    employment_type: data.employment_type
  };

  return prisma.job.create({
    data: {
      hunter_id: hunterId,
      meta_data: meta
    }
  });
};

const getApplicants = async (jobId) => {
  return prisma.jobApplication.findMany({
    where: { job_id: jobId },
    include: {
      talent: {
        select: { id: true, first_name: true, last_name: true, profil_picture: true }
      }
    }
  });
};

const updateJob = async (jobId, hunterId, data) => {
  const existingJob = await prisma.job.findUnique({
    where: { id: jobId }
  })

  if (!existingJob) throw new Error('Job not found')
  if (existingJob.hunter_id !== hunterId) throw new Error('Unauthorized')

const meta = {
    ...existingJob.meta_data,
    ...data.meta_data
  }

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: {
       meta_data: meta 
    },
  })

  return updatedJob
}
 
const deleteJob = async (jobId, hunterId) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) throw new Error('Job not found');
  if (job.hunter_id !== hunterId) throw new Error('Unauthorized');

  await prisma.job.delete({
    where: { id: jobId },
  });

  return { message: 'Job deleted successfully' };
};


const getAppliedJobs = async (userId) => {
  return prisma.jobApplication.findMany({
    where: { talent_id: userId },
    include: { job: true } 
  });
};

module.exports = {
    getRecommendedJobs,
    getAvailableJobs,
    getJobDetails,
    applyJob,
    saveJob,
    unsaveJob,
    getSavedJobs,
    getJobSave,
    getHunterJobs,
    createJob,
    getApplicants,
    updateJob,
    deleteJob,
    getAppliedJobs,
    unapplyJob
 }