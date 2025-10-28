const prisma = require('../config/db');
const { safeRedisGet, safeRedisSetEx } = require('./redisSafe');

const getUserById = async (userId) => {
  const cacheKey = `user:id:${userId}`;
  const cached = await safeRedisGet(cacheKey);
  if (cached) return JSON.parse(cached);

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
  await safeRedisSetEx(cacheKey, 600, JSON.stringify(user));
  return user;
};

const getUserByEmail = async (email) => {
  const cacheKey = `user:email:${email}`;
  const cachedUser = await safeRedisGet(cacheKey);

  if (cachedUser) return JSON.parse(cachedUser);
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
  if (user) {
    await safeRedisSetEx(cacheKey, 600, JSON.stringify(user));
  }
  return user; 
};


module.exports = { 
  getUserById,
  getUserByEmail,
 };
