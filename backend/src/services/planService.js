const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const { safeRedisGet, safeRedisSetEx } = require('./redisSafe');

const getAllPlans = async () =>{
  const cached = await safeRedisGet('all_plans');
  if(cached) return JSON.parse(cached);

  const plans = await prisma.plan.findMany({
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

  await safeRedisSetEx('all_plans', 300, JSON.stringify(plans)); // 5 دقائق
  return plans;
}

const getPlansByUserId = async (userId) =>{
  const cached = await safeRedisGet(`plans_user_${userId}`);
  if(cached) return JSON.parse(cached);

  const plans = prisma.plan.findMany({
    where: { user_id: userId },
    include: { user: true, target_level: true }
  })

  await safeRedisSetEx(`plans_user_${userId}`, 60, JSON.stringify(plans));
  return plans;
}
module.exports = {
  getAllPlans,
  getPlansByUserId
}
