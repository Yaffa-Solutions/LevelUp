import prisma from '../prismaClient.js';

export const getTalentSkills = (req, res, next) => {
  const { userId } = req.params;

  prisma.skillTalent
    .findMany({
      where: { user_id: userId },
      include: { skill: true },
    })
    .then((skills) => res.status(200).json(skills))
    .catch((err) => next(err));
};

export const addTalentSkill = (req, res, next) => {
  const { user_id, skill_name } = req.body;

  if (!user_id || !skill_name) {
    return res.status(400).json({ error: 'user_id and skill_name required' });
  }

  prisma.skill
    .findFirst({ where: { skill_name } })
    .then((skill) => {
      if (skill) {
        return skill;
      } else {
        return prisma.skill.create({ data: { skill_name } });
      }
    })
    .then((skill) => {
      return prisma.skillTalent
        .findFirst({
          where: { user_id, skill_id: skill.id },
        })
        .then((exists) => {
          if (exists) {
            throw { status: 409, message: 'Skill already added' };
          }
          return prisma.skillTalent.create({
            data: { user_id, skill_id: skill.id },
          });
        })
        .then((st) => {
          return prisma.skillTalent.findUnique({
            where: { id: st.id },
            include: { skill: true },
          });
        });
    })
    .then((result) => res.status(201).json(result))
    .catch((err) => {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
      } else {
        next(err);
      }
    });
};

export const deleteTalentSkill = (req, res, next) => {
  const { id } = req.params;

  prisma.skillTalent
    .delete({ where: { id } })
    .then(() => res.status(204).send())
    .catch((err) => next(err));
};
