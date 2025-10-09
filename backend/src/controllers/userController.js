const userService = require('../services/userService');

const getMe = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    res.status(200).json(user);
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

module.exports = { getMe };
