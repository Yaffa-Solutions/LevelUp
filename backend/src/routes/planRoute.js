const express = require('express')
const router = express.Router()
const planController = require('../controllers/planController')
const  authenticate  = require('../middleware/auth.middleware'); 

router.get('/', authenticate, planController.getPlans)
router.get('/me', authenticate, planController.getMyPlan)

module.exports = router
