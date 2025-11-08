const skillService = require('../services/skillsService.js');

const getTalentSkills = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const skills = await skillService.getTalentSkills(userId);
    res.status(200).json(skills);
  } catch (err) {
    next(err);
  }
};

const addTalentSkill = async (req, res, next) => {
  try {
    const { user_id, skill_name } = req.body;

    if (!user_id || !skill_name) {
      return res.status(400).json({ error: 'user_id and skill_name required' });
    }
    const result = await skillService.addTalentSkill(user_id, skill_name);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteTalentSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    await skillService.deleteTalentSkill(id);
    res.status(204).json({ message: 'Skill deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Skill not found' });
    }
    next(err);
  }
};

module.exports = {
  getTalentSkills,
  addTalentSkill,
  deleteTalentSkill,
};