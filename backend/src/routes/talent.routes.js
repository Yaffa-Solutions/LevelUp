const express = require('express');
const {
  getTalentById,
  updateTalentInfo,
  updateProfilePicture,
  updateCoverImage,
  updateAbout,
} = require('../controllers/talent.controller.js');

const router = express.Router();

router.get('/:id', getTalentById);

router.patch('/:id/basic', updateTalentInfo);

router.patch('/:id/profile-picture', updateProfilePicture);

router.patch('/:id/cover-image', updateCoverImage);

router.patch('/:id/about', updateAbout);

module.exports = router;
