const express = require('express');
const router = express.Router();
const { likePost, unlikePost } = require('../controllers/postReactionController');
const { authenticate } = require('../middleware/authMiddleware'); // يتحقق من JWT

router.post('/like', authenticate, likePost);
router.post('/unlike', authenticate, unlikePost);

module.exports = router;
