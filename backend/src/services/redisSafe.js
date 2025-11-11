const redisClient = require('../config/redis');

const safeRedisGet = async (key) => {
  if (!redisClient || !redisClient.isOpen) return null; 
  try {
    return await redisClient.get(key);
  } catch (err) {
    console.warn(`⚠️ Redis GET failed for key "${key}":`, err.message);
    return null;
  }
};

const safeRedisSetEx = async (key, ttl, value) => {
  if (!redisClient || !redisClient.isOpen) return; 
  try {
    await redisClient.setEx(key, ttl, value);
  } catch (err) {
    console.warn(`⚠️ Redis SETEX failed for key "${key}":`, err.message);
  }
};

const safeRedisDel = async (key) => {
  if (!redisClient || !redisClient.isOpen) return; 
  try {
    await redisClient.del(key);
  } catch (err) {
    console.warn(`⚠️ Redis DEL failed for key "${key}":`, err.message);
  }
};

module.exports = { safeRedisGet, safeRedisSetEx, safeRedisDel };
