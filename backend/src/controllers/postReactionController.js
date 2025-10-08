const { createReaction, removeReaction, countReactions } = require('../services/postReactionService');

async function likePost(req, res) {
  const userId = req.user.id; 
  const { postId } = req.body;

  try {
    const reaction = await createReaction(userId, postId);
    if (!reaction) return res.status(400).json({ message: "Already liked" });

    const totalLikes = await countReactions(postId);
    res.json({ message: "Liked", totalLikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function unlikePost(req, res) {
  const userId = req.user.id;
  const { postId } = req.body;

  try {
    await removeReaction(userId, postId);
    const totalLikes = await countReactions(postId);
    res.json({ message: "Unliked", totalLikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { likePost, unlikePost };
