const prisma = require('../config/prismaClient.js');

const getTalentSkills = async (userId) => {
  return await prisma.skillTalent.findMany({
    where: { user_id: userId },
    include: { skill: true },
  });
};

const addTalentSkill = async (user_id, skill_name) => {
  const normalizedSkillName = skill_name.trim().toUpperCase();

  let skill = await prisma.skill.findFirst({
    where: {
      skill_name: { equals: normalizedSkillName, mode: 'insensitive' },
    },
  });

  if (!skill) {
    skill = await prisma.skill.create({
      data: { skill_name: normalizedSkillName },
    });
  }
  const existing = await prisma.skillTalent.findFirst({
    where: { user_id, skill_id: skill.id },
  });

  if (existing) {
    const error = new Error('You already have this skill.');
    error.status = 409;
    throw error;
  }
  const newRelation = await prisma.skillTalent.create({
    data: { user_id, skill_id: skill.id },
  });
  const result = await prisma.skillTalent.findUnique({
    where: { id: newRelation.id },
    include: { skill: true },
  });

  return result;
};

const deleteTalentSkill = async (id) => {
  return await prisma.skillTalent.delete({ where: { id } });
};

module.exports = {
  getTalentSkills,
  addTalentSkill,
  deleteTalentSkill,
};