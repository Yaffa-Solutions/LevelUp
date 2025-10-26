const prisma = require('../prismaClient.js');

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

const getAllTalents = (req, res, next) => {
  prisma.user
    .findMany({
      where: {
        role: { in: ['TALENT', 'BOTH'] },
      },
      include: {
        levels: true,
        experiences: { orderBy: { start_date: 'desc' } },
        skillTalents: { include: { skill: true } },
      },
    })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
};
const getAllHunters = async (req, res, next) => {
  try {
    const hunters = await prisma.user.findMany({
      where: {
        role: { in: ['HUNTER', 'BOTH'] },
      },
      include: {
        levels: true,
      },
    });

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
