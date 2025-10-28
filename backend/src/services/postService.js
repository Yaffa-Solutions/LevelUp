const prisma = require('../config/db');
const { safeRedisGet, safeRedisSetEx, safeRedisDel } = require('./redisSafe');

const createPost = async (userId, content) => {
  const post = await prisma.post.create({
    data: { content, user_id: userId },
    include: {
      user: { select: { id: true,first_name: true, last_name: true, profil_picture: true } },
      postReactions: { select: { user_id: true } }
    }
  });
  await safeRedisDel('all_posts'); 
  return post;
};

const getAllPosts = async () => {
   const cached = await safeRedisGet('all_posts');
  if (cached) return JSON.parse(cached);

  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profil_picture: true,
        },
      },
      postReactions: true, 
    },
    orderBy: { created_at: 'desc' },
  });
  await safeRedisSetEx('all_posts', 120, JSON.stringify(posts));
  return posts;
};


const getPostById= async(id) =>{
   const cached = await safeRedisGet(`post_${id}`);
  if (cached) return JSON.parse(cached);

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return null;

 await safeRedisSetEx(`post_${id}`, 300, JSON.stringify(post));
  return post;
}

const getMyPosts = async (userId) => {
  const posts = await prisma.post.findMany({
    where: { user_id: userId },
    include: {
      postReactions: true,
      user: { select: { id:true,first_name: true, last_name: true, profil_picture: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return posts.map(p => ({
    ...p,
    likes: p.postReactions.length,
    userLiked: p.postReactions.some(r => r.user_id === userId),
  }));
};

const updatePost= async(postId, userId,data) =>{
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post not found');
  if (post.user_id !== userId) throw new Error('Unauthorized: You can only edit your own posts');

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { content: data.content },
  });

  await safeRedisDel(`post_${postId}`);
  await safeRedisDel('all_posts');
  return updated;
}

const deletePost = async (postId, userId) =>{
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post not found');
  if (post.user_id !== userId) throw new Error('Unauthorized: You can only delete your own posts');

  const deleted = await prisma.post.delete({ where: { id: postId } });

  await safeRedisDel(`post_${postId}`);
  await safeRedisDel('all_posts');

  return deleted;
}

const getAllPostsWithLikes = async (userId) => {
  const posts = await prisma.post.findMany({
    include: {
      user: { select: { id: true,first_name: true, last_name: true, profil_picture: true } },
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

  let result;
  if (existing) {
    await prisma.postReactions.delete({ where: { id: existing.id } })
    result = { liked: false }
  } else {
    await prisma.postReactions.create({
      data: { user_id: userId, post_id: postId }
    })
    result = { liked: true }
  }

  await safeRedisDel(`post_${postId}`);
  await safeRedisDel('all_posts');

  return result;
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getAllPostsWithLikes,
  toggleLike
};
