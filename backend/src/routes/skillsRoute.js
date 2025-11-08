const express = require ('express');
const {
  getTalentSkills,
  addTalentSkill,
  deleteTalentSkill,
} = require ('../controllers/skillsController.js');
const  authenticate  = require('../middleware/auth.middleware'); 

const router = express.Router();

router.get('/talent/:userId',authenticate, getTalentSkills);

router.post('/', authenticate, addTalentSkill);

router.delete('/:id', authenticate, deleteTalentSkill);

module.exports = router;