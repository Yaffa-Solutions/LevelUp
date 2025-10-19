const { createReaction, removeReaction, countReactions, getAllReactionsService, getPostsLikedByUser } = require('../services/postReactionService');

const likePost = async (req, res) =>{
  console.log("Authenticated user:", req.user);
  console.log("Request body:", req.body);

  const userId = req.user.userId; 
  const { postId } = req.body;

  if (!userId) return res.status(401).json({ message: "User not authenticated" });
  if (!postId) return res.status(400).json({ message: "postId is required" });

  try {
    const reaction = await createReaction(userId, postId);
    const totalLikes = await countReactions(postId);

    if (!reaction) return res.status(400).json({ message: "Already liked" });

    res.json({ message: "Liked", totalLikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

const unlikePost = async (req, res) => {
  const userId = req.user.userId;
  const { postId } = req.body;

  if (!userId) return res.status(401).json({ message: "User not authenticated" });
  if (!postId) return res.status(400).json({ message: "postId is required" });

  try {
    const removed = await removeReaction(userId, postId);
    if (!removed) return res.status(400).json({ message: "Reaction not found" });

    const totalLikes = await countReactions(postId);
    res.json({ message: "Unliked", totalLikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getPostLikes = async (req, res) => {
  const { postId } = req.params;

  if (!postId) return res.status(400).json({ message: "postId is required" });

  try {
    const totalLikes = await countReactions(postId);
    res.json({ postId, totalLikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

const getAllReactions = async (req, res) => {
  const { postId } = req.params;
  if (!postId) return res.status(400).json({ message: "postId is required" });

  try {
    const reactions = await getAllReactionsService(postId);
    res.json({ postId, reactions });
  } catch (err) {
    console.error("Error in getAllReactions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getLikedPosts = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "User not authenticated" });

  try {
    const likedPosts = await getPostsLikedByUser(userId);
    res.json({ likedPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { 
  likePost, 
  unlikePost, 
  getPostLikes, 
  getAllReactions, 
  getLikedPosts 
};
