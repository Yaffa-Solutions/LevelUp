const express = require('express');
const {
  getUserById,
  getUserByIdPublic,
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

router.get('/',authenticate, getUserById);

router.get('/:userId', getUserByIdPublic);

router.patch('/basic',authenticate, updateUserInfo);

router.patch('/profile-picture',authenticate, updateProfilePicture);

router.patch('/about',authenticate, updateAbout);

router.patch('/company-description',authenticate, updateCompanyDescription);





module.exports = router;
