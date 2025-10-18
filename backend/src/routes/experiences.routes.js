const express = require('express');
const {
  getTalentExperiences,
  addNewExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experiences.controller.js');

const router = express.Router();

router.get('/talent/:id', getTalentExperiences);

router.post('/', addNewExperience);

router.patch('/:id', updateExperience);

router.delete('/:id', deleteExperience);

module.exports = router;

