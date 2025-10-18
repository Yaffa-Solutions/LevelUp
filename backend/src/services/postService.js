const prisma = require('../config/db');

const createPost = async (userId, content) => {
  return prisma.post.create({
    data: { content, user_id: userId },
    include: {
      user: { select: { first_name: true, last_name: true, profil_picture: true } },
      postReactions: { select: { user_id: true } }
    }
  });
};

const getAllPosts = async () => {
  return await prisma.post.findMany({
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
          profil_picture: true,
        },
      },
      postReactions: true, 
    },
    orderBy: { created_at: 'desc' },
  });
};


const getPostById= async(id) =>{
  return await prisma.post.findUnique({ where: { id } });
}

const updatePost= async(id, data) =>{
  return await prisma.post.update({
    where: { id },
    data: { content: data.content },
  });
}

const deletePost = async (id) =>{
  return await prisma.post.delete({ where: { id } });
}

const getAllPostsWithLikes = async (userId) => {
  const posts = await prisma.post.findMany({
    include: {
      user: { select: { first_name: true, last_name: true, profil_picture: true } },
      postReactions: { select: { user_id: true } }
    },
    orderBy: { created_at: 'desc' }
  });

  return posts.map(p => ({
    ...p,
    likes: p.postReactions.length,
    userLiked: userId ? p.postReactions.some(r => r.user_id === userId) : false
  }));
};

const toggleLike = async (userId, postId) => {
  const existing = await prisma.postReactions.findFirst({
    where: { user_id: userId, post_id: postId }
  })

  if (existing) {
    await prisma.postReactions.delete({ where: { id: existing.id } })
    return { liked: false }
  } else {
    await prisma.postReactions.create({
      data: { user_id: userId, post_id: postId }
    })
    return { liked: true }
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getAllPostsWithLikes,
  toggleLike
};
