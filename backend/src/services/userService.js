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
      levels: {
        select: {
          name: true 
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
      levels: {
        select: {
          name: true
        }
      }
    }
  });
  return user; 
};


module.exports = { 
  getUserById,
  getUserByEmail,
 };
