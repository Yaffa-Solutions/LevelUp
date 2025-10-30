const prisma = require('../config/prismaClient.js');

const getTalentSkills = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const skills = await prisma.skillTalent.findMany({
      where: { user_id: userId },
      include: { skill: true },
    });

    res.status(200).json(skills);
  } catch (err) {
    next(err);
  }
};

const addTalentSkill = async (req, res, next) => {
  try {
    const { user_id, skill_name } = req.body;

    if (!user_id || !skill_name) {
      return res.status(400).json({ error: 'user_id and skill_name required' });
    }

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
      return res.status(409).json({ error: 'You already have this skill.' });
    }
    const newRelation = await prisma.skillTalent.create({
      data: { user_id, skill_id: skill.id },
    });
    const result = await prisma.skillTalent.findUnique({
      where: { id: newRelation.id },
      include: { skill: true },
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteTalentSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    await prisma.skillTalent.delete({ where: { id } });
    res.status(200).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Skill not found' });
    }
    next(err);
  }
};

module.exports = {
  getTalentSkills,
  addTalentSkill,
  deleteTalentSkill,
};