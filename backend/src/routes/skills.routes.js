import express from 'express';
import {
  getTalentSkills,
  addTalentSkill,
  deleteTalentSkill,
} from '../controllers/skills.controller.js';

const router = express.Router();

router.get('/talent/:userId', getTalentSkills);

router.post('/',addTalentSkill);

router.delete('/:id',deleteTalentSkill);

export default router;
