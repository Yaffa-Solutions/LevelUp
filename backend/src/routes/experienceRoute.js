// const express = require('express');
// const router = express. Router();
// const { createExperience } = require('../controllers/addexperienceController');
// // للتحتق من المستخدم middleware مثال //
// // router.use((req, res, next) => {
// // req.userId = 'uuid-of-user'; // لاحقاُ استبداله بالـ JWT
// // next();
// // })
// router.post('/', createExperience);
// module.exports = router;
const express = require('express');
const {
  getTalentExperiences,
  addNewExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experienceController.js');
const  authenticate  = require('../middleware/auth.middleware'); 

const router = express.Router();

router.get('/talent/:id', authenticate, getTalentExperiences);

router.post('/', authenticate, addNewExperience);

router.patch('/:id', authenticate, updateExperience);

router.delete('/:id', authenticate, deleteExperience);

module.exports = router;
