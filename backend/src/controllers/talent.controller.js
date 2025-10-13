import prisma from '../prismaClient.js';

export const getTalentById = (req, res, next) => {
  const { id } = req.params;

  prisma.user
    .findUnique({
      where: { id },
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

export const updateProfilePicture = (req, res, next) => {
  const { id } = req.params;
  const { profil_picture } = req.body;

  prisma.user
    .update({
      where: { id },
      data: { profil_picture },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};

export const updateCoverImage = (req, res, next) => {
  const { id } = req.params;
  const { cover_image } = req.body;

  prisma.user
    .update({
      where: { id },
      data: { cover_image },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};
export const updateTalentInfo = (req, res, next) => {
  const { id } = req.params;
  const { first_name, last_name, job_title, level_id } = req.body;

  prisma.user
    .update({
      where: { id },
      data: { first_name, last_name, job_title, level_id },
      include: { levels: true },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};

export const updateAbout = (req, res, next) => {
  const { id } = req.params;
  const { about } = req.body;

  prisma.user
    .update({
      where: { id },
      data: { about },
    })
    .then((user) => res.status(200).json(user))
    .catch(next);
};
