const express = require ('express');
const {
  getTalentSkills,
  addTalentSkill,
  deleteTalentSkill,
} = require ('../controllers/skills.controller.js');

const router = express.Router();

router.get('/talent/:userId', getTalentSkills);

router.post('/',addTalentSkill);

router.delete('/:id',deleteTalentSkill);

module.exports = router;
