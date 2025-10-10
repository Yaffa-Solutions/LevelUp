const prisma = require('../config/db');

const createPost = async(data) =>{
  return await prisma.post.create({
    data: {
      user_id: data.user_id,
      content: data.content,
    },
  });
}

// const getAllPosts= async() =>{
//   return await prisma.post.findMany({
//     orderBy: { created_at: 'desc' },
//   });
// }

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

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
