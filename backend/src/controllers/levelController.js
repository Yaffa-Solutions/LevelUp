const levelService = require('../services/levelService');

const getAllLevels = async (req, res) =>{
  try {
    const levels = await levelService.getAllLevels();
    res.json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const getLevelById = async (req, res) =>{
  try {
    const { id } = req.params;
    const level = await levelService.getLevelById(id);
    if (!level) return res.status(404).json({ message: 'Level not found' });
    res.json(level);
  } catch (error) {
    console.error('Error fetching level:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllLevels, getLevelById };
