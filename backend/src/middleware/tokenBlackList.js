const redis = require('../config/redis');

const TOKEN_BLACKLIST_PREFIX = 'blacklist:';

const addTokenToBlacklist = async(token, exp) =>{
  try {
    const ttl = exp - Math.floor(Date.now() / 1000); 
    if (ttl > 0) {
      await redis.set(`${TOKEN_BLACKLIST_PREFIX}${token}`, 'true', { EX: ttl });
    }
  } catch (error) {
    console.error('Redis error while blacklisting token:', error.message);
  }
}

const isTokenBlacklisted = async (token) =>{
  try {
    const result = await redis.get(`${TOKEN_BLACKLIST_PREFIX}${token}`);
    return result === 'true';
  } catch (error) {
    console.error('Redis error while checking token blacklist:', error.message);
    return false;
  }
}

module.exports = { addTokenToBlacklist, isTokenBlacklisted };
