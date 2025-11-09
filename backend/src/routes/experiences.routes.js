const express = require('express');
const {
  getTalentExperiences,
  addNewExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experiences.controller.js');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/talent/:id',authenticate, getTalentExperiences);

router.post('/',authenticate, addNewExperience);

router.patch('/:id',authenticate, updateExperience);

router.delete('/:id',authenticate, deleteExperience);

module.exports = router;

