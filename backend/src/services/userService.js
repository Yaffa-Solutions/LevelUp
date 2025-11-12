const prisma = require('../config/db');

const getUserById = async (userId) => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      profil_picture: true,
      role: true,
      about: true,
      company_name: true,
      job_title: true,
      company_description: true,
      levels: {
        select: {
          name: true 
        }
      },
      experiences: {
        select: {
          id: true,
          company_name: true,
          position: true,
          start_date: true,
          end_date: true,
          description: true,
          employment_type: true
        }
      },
      skillTalents: {
        select: {
          id: true,
          skill: {
            select: { skill_name: true }
          }
        }
      }
    }
  });

  if (!user) throw new Error('User not found');
  return user;
};

const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      profil_picture: true,
      role: true,
      is_verified: true,          
      is_profile_complete: true,
      levels: {
        select: {
          name: true
        }
      }
    }
  });
  return user; 
};

const updateUserProfile = async (userId, data) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      profil_picture: true,
      role: true,
      levels: { select: { name: true } },
    },
  });

  return updatedUser;
};

module.exports = { 
  getUserById,
  getUserByEmail,
  updateUserProfile
 };
