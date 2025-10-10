import express from 'express';
import { getTalentExperiences, addNewExperience, updateExperience, deleteExperience } from '../controllers/experiences.controller.js';

const router = express.Router();

router.get('/talent/:id', getTalentExperiences);

router.post('/',addNewExperience );

router.patch('/:id', updateExperience);

router.delete('/:id',deleteExperience);

export default router;
