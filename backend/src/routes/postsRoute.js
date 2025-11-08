const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const authenticate = require('../middleware/auth.middleware');

// router.post('/', postController.create);
router.get('/withlikes', authenticate, postController.getPosts);
router.get('/', postController.getAll);
router.get('/:id', postController.getOne);
router.put('/:id', postController.update);
router.delete('/:id', postController.remove);

router.post('/', authenticate, postController.addPost);
router.post('/like', authenticate, postController.handleLike)
router.get('/my-posts', authenticate, postController.getMyPosts);

module.exports = router
