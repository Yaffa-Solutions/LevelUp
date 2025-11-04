const prisma = require('../config/prismaClient.js');
const { safeRedisGet, safeRedisSetEx } = require('../config/redis.js');

const findUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      levels: true,
      experiences: { orderBy: { start_date: 'desc' } },
      skillTalents: { include: { skill: true } },
    },
  });
};

const updateProfilePicture = async (userId, profil_picture) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { profil_picture },
  });
};

const updateProfileInfo = async (
  userId,
  first_name,
  last_name,
  job_title,
  company_name
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { first_name, last_name, job_title, company_name },
    include: { levels: true },
  });
};

const updateAbout = async (userId, about) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { about },
  });
};

const findTalentsByLevel = async (levelId) => {
  return await prisma.user.findMany({
    where: { level_id: levelId },
    include: { levels: true },
  });
};

const updateCompanyDescription = async (userId, company_description) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { company_description },
  });
};

const getAllTalents = async () => {
  let cachedData;
  cachedData = await safeRedisGet('all_talents');

  console.log('Read talents from Redis:', cachedData);

  if (cachedData) {
    console.log('Cache Hit, talents from redis cache');
    return res.status(200).json(JSON.parse(cachedData));
  }
  console.log('Cache Miss, fetching talents from database');
  const talents = await prisma.user.findMany({
    where: {
      role: { in: ['TALENT', 'BOTH'] },
    },
    include: {
      levels: true,
      experiences: { orderBy: { start_date: 'desc' } },
      skillTalents: { include: { skill: true } },
    },
  });
  await safeRedisSetEx('all_talents', 360, JSON.stringify(talents));
  const test = await safeRedisGet('all_talents');
  console.log('Read talents from Redis:', test);
  console.log('Talents cached in redis');

  return talents;
};

const getAllHunters = async () => {
    let cachedData;
    cachedData = await safeRedisGet('all_hunters');

    console.log('Read hunters from Redis:', cachedData);

    if (cachedData) {
      console.log('Cache Hit, fetching hunters from redis cache');
      return res.json(JSON.parse(cachedData));
    }
    console.log('Cache Miss ,fetching  hunters from database');
    const hunters = await prisma.user.findMany({
      where: {
        role: { in: ['HUNTER', 'BOTH'] },
      },
      include: {
        levels: true,
      },
    });

    await safeRedisSetEx('all_hunters', 360, JSON.stringify(hunters));

    const test = await safeRedisGet('all_hunters');

    console.log('Read hunters from Redis:', test);
    console.log('Hunters cached in redis');

    return hunters;
};

module.exports = {
  findUserById,
  updateProfilePicture,
  updateProfileInfo,
  updateAbout,
  findTalentsByLevel,
  updateCompanyDescription,
  getAllTalents,
  getAllHunters
};
