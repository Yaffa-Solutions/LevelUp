const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const createReaction = async (userId, postId) => {
  try {
    const existing = await prisma.postReaction.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: postId } }
    });
    if (existing) return null;

    return await prisma.postReaction.create({
      data: { user_id: userId, post_id: postId }
    });
  } catch (err) {
    console.error("Error in createReaction:", err);
    throw err;
  }
};


const removeReaction = async (userId, postId) =>{
  return prisma.postReaction.delete({
    where: { user_id_post_id: { user_id: userId, post_id: postId } }
  });
}

const countReactions = async (postId) =>{
  return prisma.postReaction.count({
    where: { post_id: postId }
  });
}

const getAllReactionsService = async (postId) => {
  return prisma.postReaction.findMany({
    where: { post_id: postId },
    select: { user_id: true },
  });
};

const getPostsLikedByUser = async (userId) => {
  return prisma.postReaction.findMany({
    where: { user_id: userId },
    select: { post_id: true },
  });
};


module.exports = { 
  createReaction, 
  removeReaction, 
  countReactions, 
  getAllReactionsService, 
  getPostsLikedByUser 
};
