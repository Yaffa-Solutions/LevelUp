const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();


const getAllPlans = async () =>{
  return await prisma.plan.findMany({
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
          profil_picture: true,
          job_title: true,
          company_name: true,
          experiences: true,
          skillTalents: { include: { skill: true } },
        },
      },
      target_level: true,
    },
    orderBy: { started_time: 'desc' },
  })
}

const getPlansByUserId = async (userId) =>{
  return prisma.plan.findMany({
    where: { user_id: userId },
    include: { user: true, target_level: true }
  })
}
module.exports = {
  getAllPlans,
  getPlansByUserId
}
