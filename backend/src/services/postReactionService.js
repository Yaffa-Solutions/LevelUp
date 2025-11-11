const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const { safeRedisGet, safeRedisSetEx, safeRedisDel } = require('./redisSafe');

const createReaction = async(userId, postId) =>{
  const existing = await prisma.postReaction.findUnique({
    where: { user_id_post_id: { user_id: userId, post_id: postId } }
  });

  if (existing) return null;

  const reaction = await prisma.postReaction.create({
    data: { user_id: userId, post_id: postId }
  });

  await safeRedisDel(`post_${postId}_reactions`);
  await safeRedisDel(`post_${postId}_reactions_list`);
  await safeRedisDel(`user_${userId}_liked_posts`);
  return reaction;
}

const removeReaction = async (userId, postId) =>{
  const reaction = await prisma.postReaction.delete({
    where: { user_id_post_id: { user_id: userId, post_id: postId } }
  });

  await safeRedisDel(`post_${postId}_reactions`);
  await safeRedisDel(`post_${postId}_reactions_list`);
  await safeRedisDel(`user_${userId}_liked_posts`);
  return reaction;
}

const countReactions = async (postId) =>{
  const cached = await safeRedisGet(`post_${postId}_reactions`);
  if (cached) return parseInt(cached);

   const count = await prisma.postReaction.count({
    where: { post_id: postId }
  });
  await safeRedisSetEx(`post_${postId}_reactions`, 10, count.toString());
  return count;
}

const getAllReactionsService = async (postId) => {
  const cached = await safeRedisGet(`post_${postId}_reactions_list`);
  if (cached) return JSON.parse(cached);

  const reactions = await prisma.postReaction.findMany({
    where: { post_id: postId },
    select: { user_id: true },
  });

  await safeRedisSetEx(`post_${postId}_reactions_list`, 10, JSON.stringify(reactions));
  return reactions;
};

const getPostsLikedByUser = async (userId) => {
  const cached = await safeRedisGet(`user_${userId}_liked_posts`);
  if (cached) return JSON.parse(cached);

  const posts = await prisma.postReaction.findMany({
    where: { user_id: userId },
    select: { post_id: true },
  });

  await safeRedisSetEx(`user_${userId}_liked_posts`, 15, JSON.stringify(posts));
  return posts;
};


module.exports = { 
  createReaction, 
  removeReaction, 
  countReactions, 
  getAllReactionsService, 
  getPostsLikedByUser 
};
