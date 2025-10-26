const express = require('express');
const {
  getUserById,
  updateUserInfo,
  updateProfilePicture,
  updateCoverImage,
  updateAbout,
  updateCompanyDescription,
  getTalentsByLevel,
  getAllTalents,
  getAllHunters,
} = require('../controllers/user.controller.js');

const router = express.Router();

router.get('/talents', getAllTalents);

router.get('/hunters', getAllHunters);

router.get('/level/:levelId', getTalentsByLevel);

router.get('/:userId', getUserById);

router.patch('/:userId/basic', updateUserInfo);

router.patch('/:userId/profile-picture', updateProfilePicture);

router.patch('/:userId/cover-image', updateCoverImage);

router.patch('/:userId/about', updateAbout);

router.patch('/:userId/company-description', updateCompanyDescription);





module.exports = router;
