const express = require('express')
const router = express.Router()
const {
  createProfile,
  getProfile,
  addExperience,
  addSkill
} = require('../controllers/profile.controller.js')

router.post('/', createProfile)
router.get('/:userId', getProfile)
router.post('/experience', addExperience)
router.post('/skill', addSkill)

module.exports = router
