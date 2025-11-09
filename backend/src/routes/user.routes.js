const express = require('express');
const {
  getUserById,
  updateUserInfo,
  updateProfilePicture,
  updateAbout,
  updateCompanyDescription,
  getTalentsByLevel,
  getAllTalents,
  getAllHunters,
} = require('../controllers/user.controller.js');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/talents', getAllTalents);

router.get('/hunters', getAllHunters);

router.get('/level/:levelId', getTalentsByLevel);

router.get('/:userId', getUserById);

router.patch('/:userId/basic',authenticate, updateUserInfo);

router.patch('/:userId/profile-picture',authenticate, updateProfilePicture);

router.patch('/:userId/about',authenticate, updateAbout);

router.patch('/:userId/company-description',authenticate, updateCompanyDescription);





module.exports = router;
