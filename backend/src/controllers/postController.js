const postService = require('../services/postService')

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

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};

