const express = require('express');
const router = express.Router();
const { likePost, unlikePost, getPostLikes, getAllReactions, getLikedPosts } = require('../controllers/postReactionController');
const  authenticate  = require('../middleware/auth.middleware'); 

router.post('/like', authenticate, likePost);
router.post('/unlike', authenticate, unlikePost);
router.get('/likes/:postId', authenticate, getPostLikes);
router.get('/all/:postId', authenticate, getAllReactions);
router.get('/liked', authenticate, getLikedPosts);

module.exports = router;
