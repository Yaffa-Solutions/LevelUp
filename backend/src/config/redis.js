const redis = require('redis');
const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.warn('⚠️ Redis connection error', err.message));

let redisReady = false;

(async () => {
  try {
    await redisClient.connect();
    redisReady = true;
    console.log('✅ Redis connected');
  } catch (err) {
    console.warn('⚠️ Redis not available, caching disabled');
  }
})();

const safeRedisGet = async (key) => {
  if (!redisReady) return null;
  try { return await redisClient.get(key); } 
  catch { return null; }
};

const safeRedisSetEx = async (key, ttl, value) => {
  if (!redisReady) return;
  try { await redisClient.setEx(key, ttl, value); } 
  catch {}
};

const safeRedisDel = async (key) => {
  if (!redisReady) return;
  try { await redisClient.del(key); } 
  catch {}
};

module.exports = { redisClient, safeRedisGet, safeRedisSetEx, safeRedisDel };
