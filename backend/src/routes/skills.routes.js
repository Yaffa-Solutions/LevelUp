const express = require ('express');
const {
  getTalentSkills,
  addTalentSkill,
  deleteTalentSkill,
} = require('../controllers/skills.controller.js');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/talent',authenticate, getTalentSkills);

router.post('/',authenticate, addTalentSkill);

router.delete('/:id',authenticate, deleteTalentSkill);

module.exports = router;
