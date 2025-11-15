const { createUserProfile } = require('../services/createprofileService');

const createProfile = async (req, res) => {
  try {
    const userId = req.user?.userId; 
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const data = {
      userId,
      role: req.body.role,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      about: req.body.about,
      jobTitle: req.body.jobTitle,
      companyName: req.body.companyName,
      companyDesc: req.body.companyDesc,
      skills: req.body.skills || [],
      experiences: req.body.experiences || [],
      profilePicture: req.body.profilePicture,
    };

    const updatedUser = await createUserProfile(data);
    res.status(200).json({ message: 'Profile saved successfully', user: updatedUser });
  } catch (error) {
    console.error('❌ Error saving profile:', error.message);
    res.status(500).json({ error: 'Failed to save profile' });
  }
};

module.exports ={
    createProfile,
}