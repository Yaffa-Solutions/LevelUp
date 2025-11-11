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
  const userId = req.user.userId;
  const postId = req.params.id;

  try {
    const post = await postService.updatePost(postId, userId, req.body);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const remove = async (req, res) =>{
  const userId = req.user.userId;
  const postId = req.params.id;

  try {
    await postService.deletePost(postId, userId);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getPostsController = async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await postService.getAllPosts(); 
    const likedPosts = await getPostsLikedByUser(userId) ;
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
const getPosts = async (req, res) => {
  const userId = req.user?.userId;
  try {
    const posts = await postService.getAllPostsWithLikes(userId);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addPost = async (req, res) => {
  const userId = req.user?.userId;
  const { content } = req.body;

  if (!userId) return res.status(401).json({ message: "User not authenticated" });
  if (!content) return res.status(400).json({ message: "Content is required" });

  try {
    const post = await postService.createPost(userId, content);
    post.likes = post.postReactions.length;
    post.userLiked = false; 
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const handleLike = async (req, res) => {
  try {
    const userId = req.user.userId
    const { postId } = req.body

    const result = await postService.toggleLike(userId, postId)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
const getMyPosts = async (req, res) => {
  const userId = req.user.userId;
  try {
    const posts = await postService.getMyPosts(userId);
    res.json(posts);
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
  getPostsController,
  getPosts, 
  addPost,
  handleLike,
  getMyPosts, 
};

