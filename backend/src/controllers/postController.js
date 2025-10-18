const postService = require('../services/postService')
const { getPostsLikedByUser } = require('../services/postReactionService');

const create = async (req, res) =>{
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getAll = async (req, res) =>{
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getOne = async (req, res) =>{
  try {
    const post = await postService.getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const update = async (req, res) =>{
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const remove = async (req, res) =>{
  try {
    await postService.deletePost(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getPostsController = async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await postService.getAllPosts(); 
    const likedPosts = await getPostsLikedByUser(userId);
    const likedPostIds = likedPosts.map(p => p.post_id);

    const mappedPosts = posts.map(p => ({
      ...p,
      likes: p.postReactions.length,
      userLiked: likedPostIds.includes(p.id),
    }));

    res.json(mappedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
  getPostsController
};

