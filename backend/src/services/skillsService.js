const { prisma } = require("../config/db");

const getTalentExperiences = async (userId) => {
  return await prisma.experience.findMany({
    where: { user_id: userId },
    orderBy: { start_date: 'desc' },
  });
};

const addNewExperience = async (
  user_id,
  company_name,
  position,
  start_date,
  end_date,
  description,
  employment_type
) => {
  return await prisma.experience.create({
    data: {
      user_id,
      company_name,
      position,
      start_date: new Date(start_date),
      end_date: end_date ? new Date(end_date) : null,
      description: description || '',
      employment_type: employment_type || '',
    },
  });
};

const updateExperience = async (
  id,
  company_name,
  position,
  start_date,
  end_date,
  description,
  employment_type
) => {
  return await prisma.experience
    .update({
      where: { id },
      data: {
        company_name,
        position,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        description,
        employment_type,
      },
    });
};

const deleteExperience = async (id) => {
  return await prisma.experience.delete({ where: { id } });
};

module.exports = {
  getTalentExperiences,
  addNewExperience,
  updateExperience,
  deleteExperience,
};