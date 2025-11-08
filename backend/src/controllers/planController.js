const planService = require('../services/planService')

const getPlans = async (req, res) =>{
  try {
    const plans = await planService.getAllPlans()
    res.json(plans)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch plans' })
  }
}

const getMyPlan = async (req, res) =>{
  try {
    const userId = req.user.userId
    const plan = await planService.getPlansByUserId(userId)
    res.json(plan)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch user plan' })
  }
}

module.exports = {
  getPlans,
 getMyPlan
}
