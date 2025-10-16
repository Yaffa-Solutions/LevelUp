const { PrismaClient, Prisma   } = require('../generated/prisma');
const prisma = new PrismaClient();


const getRecommendedJobs = async (userId) => {
  if (!userId) throw new Error('userId is required');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { levels: true }
  });

  if (!user) throw new Error('User not found');

  const jobs = await prisma.job.findMany({
    where: {
      meta_data: {
        path: ['level'],
        equals: user.levels.name
      }
    }
  });

  return jobs;
};

const getAvailableJobs = async () => {
  return prisma.job.findMany();
};


const getJobDetails = async (jobId) => {
  return prisma.job.findUnique({ where: { id: jobId } });
};


// const applyJob = async (userId, jobId) => {
//   const exists = await prisma.jobApplication.findFirst({
//     where: { job_id: jobId, talent_id: userId }
//   });
//   if (exists) throw new Error('Already applied');

//   return prisma.jobApplication.create({
//     data: {
//       job_id: jobId,
//       talent_id: userId,
//       // status: 'ACCEPTED' i suppose make pending status
//     }
//   });
// };

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


const saveJob = async (userId, jobId) => {
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


const getSavedJobs = async (userId) => {
  return prisma.jobSave.findMany({
    where: { talent_id: userId },
    include: { job: true }
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
  return prisma.job.create({
    data: {
      hunter_id: hunterId,
      // meta_data: data // suppose seperating these data to simplify reaching for them
      meta_data: { ...data }
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

module.exports = {
    getRecommendedJobs,
    getAvailableJobs,
    getJobDetails,
    applyJob,
    saveJob,
    getSavedJobs,
    getHunterJobs,
    createJob,
    getApplicants
 }