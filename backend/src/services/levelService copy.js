const { PrismaClient  } = require('../generated/prisma');
const prisma = new PrismaClient();
const { safeRedisGet, safeRedisSetEx } = require('./redisSafe');
const getAllLevels = async () =>{
  const cached = await safeRedisGet('all_levels');
  if(cached) return JSON.parse(cached);

  const levels = await prisma.userLevels.findMany();
  await safeRedisSetEx('all_levels', 600, JSON.stringify(levels)); 
  return levels;
}

const getLevelById = async(id) =>{
  const cached = await safeRedisGet(`level_${id}`);
  if(cached) return JSON.parse(cached);

  const level = await prisma.userLevels.findUnique({
    where: { id },
  });

  await safeRedisSetEx(`level_${id}`, 600, JSON.stringify(level));
  return level;
}

module.exports = { getAllLevels, getLevelById };
