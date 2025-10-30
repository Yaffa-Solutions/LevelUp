const prisma = require('../config/prismaClient.js');
const { safeRedisGet, safeRedisSetEx } = require('../config/redis.js');

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  prisma.user
    .findUnique({
      where: { id: userId },
      include: {
        levels: true,
        experiences: { orderBy: { start_date: 'desc' } },
        skillTalents: { include: { skill: true } },
      },
    })
    .then((user) => {
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
    })
    .catch(next);
};

const updateProfilePicture = (req, res, next) => {
  const { userId } = req.params;
  const { profil_picture } = req.body;

  prisma.user
    .update({
      where: { id: userId },
      data: { profil_picture },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};

const updateCoverImage = (req, res, next) => {
  const { userId } = req.params;
  const { cover_image } = req.body;

  prisma.user
    .update({
      where: { id: userId },
      data: { cover_image },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};
const updateUserInfo = (req, res, next) => {
  const { userId } = req.params;
  const { first_name, last_name, job_title, level_id, company_name } = req.body;

  prisma.user
    .update({
      where: { id: userId },
      data: { first_name, last_name, job_title, level_id, company_name },
      include: { levels: true },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};

const updateAbout = (req, res, next) => {
  const { userId } = req.params;
  const { about } = req.body;

  prisma.user
    .update({
      where: { id: userId },
      data: { about },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};

const getTalentsByLevel = async (req, res, next) => {
  const { levelId } = req.params;
  const users = await prisma.user.findMany({
    where: { level_id: levelId },
    include: { levels: true },
  });
  res.json(users);
};

const getAllTalents = async (req, res, next) => {
  try {
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

    res.status(200).json(talents);
  } catch (error) {
    next(error);
  }
};
const getAllHunters = async (req, res, next) => {
  try {
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

    await safeRedisSetEx('all_hunters', 360 , JSON.stringify(hunters));

    const test = await safeRedisGet('all_hunters');

    console.log('Read hunters from Redis:', test);
    console.log('Hunters cached in redis');

    res.status(200).json(hunters);
  } catch (error) {
    next(error);
  }
};

const updateCompanyDescription = (req, res, next) => {
  const { userId } = req.params;
  const { company_description } = req.body;

  prisma.user
    .update({
      where: { id: userId },
      data: { company_description },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};
module.exports = {
  getUserById,
  updateProfilePicture,
  updateCoverImage,
  updateUserInfo,
  updateAbout,
  getTalentsByLevel,
  getAllTalents,
  getAllHunters,
  updateCompanyDescription,
};
