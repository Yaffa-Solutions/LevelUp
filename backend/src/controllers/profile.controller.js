// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
const prisma = require('../config/prismaClient.js');

exports.createProfile = async (req, res) => {
  const { email, first_name, last_name, role, level_id } = req.body;

  const user = await prisma.user.create({
    data: {
      first_name,
      last_name,
      about,
      role,
      company_name,
      company_description,
      level_id,
      job_title,
      cv_url,
      experiences,
      skillTalents,
    },
  });

  res.status(201).json({ message: 'Profile created', user });
};

exports.getProfile = async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      experiences: true,
      skillTalents: {
        include: { skill: true },
      },
      jobs: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
};

exports.addExperience = async (req, res) => {
  const {
    user_id,
    company_name,
    position,
    start_date,
    end_date,
    description,
    employment_type,
  } = req.body;

  const exp = await prisma.experience.create({
    data: {
      user_id,
      company_name,
      position,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      description,
      employment_type,
    },
  });

  res.status(201).json({ message: 'Experience added', exp });
};

exports.addSkill = async (req, res) => {
  const { user_id, skill_name } = req.body;

  let skill = await prisma.skill.findFirst({
    where: { skill_name: skill_name },
  });

  if (!skill) {
    skill = await prisma.skill.create({ data: { skill_name } });
  }

  const skillTalent = await prisma.skillTalent.create({
    data: {
      user_id,
      skill_id: skill.id,
    },
  });

  res.status(201).json({ message: 'Skill added', skillTalent });
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { email, first_name, last_name, role, level_id } = req.body;
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      first_name,
      last_name,
      about,
      role,
      company_name,
      company_description,
      level_id,
      job_title,
      cv_url,
      experiences,
      skillTalents,
    },
  });
  res.status(200).json({ message: 'Profile updated', user });
};

exports.deleteProfile = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.status(200).json({ message: 'Profile deleted' });
};
