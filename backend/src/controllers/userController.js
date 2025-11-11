const userService = require('../services/userService');

const getMe = async (req, res) => {
  try {
    const { userId, is_profile_complete } = req.user;

    const token = req.headers.authorization?.split(' ')[1];
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const tokenFromHeader = req.headers.authorization?.split(' ')[1];
    const tokenFromCookie = req.cookies?.token;

    if (!is_profile_complete) {
      return res.status(200).json({
        status: 'PROFILE_INCOMPLETE',
        message: 'Profile not complete',
        redirect: '/create-profile',
        token: tokenFromCookie || tokenFromHeader || null,
        userId,
      });
    }

    const user = await userService.getUserById(userId);
    res.status(200).json({
      user, 
      token: tokenFromCookie || tokenFromHeader || null,
      status: 'PROFILE_COMPLETE',
    });

  } catch (err) {
    console.error('Error in getMe:', err.message);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

module.exports = { getMe };
