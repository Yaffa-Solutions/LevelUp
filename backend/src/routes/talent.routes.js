import express from 'express';
import {
  getTalentById,
  updateTalentInfo,
  updateProfilePicture,
  updateCoverImage,
  updateAbout,
} from '../controllers/talent.controller.js';
const router = express.Router();

router.get('/:id', getTalentById);

router.patch('/:id/basic', updateTalentInfo);

router.patch('/:id/profile-picture', updateProfilePicture);

router.patch('/:id/cover-image', updateCoverImage);

router.patch('/:id/about', updateAbout);

export default router;
