const userService = require('../services/user.service.js');

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.findUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { profil_picture } = req.body;
    const updateUser = await userService.updateProfilePicture(
      userId,
      profil_picture
    );
    res.status(200).json(updateUser);
  } catch (err) {
    next(err);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { first_name, last_name, job_title, company_name } = req.body;
    const updateUser = await userService.updateProfileInfo(
      userId,
      first_name,
      last_name,
      job_title,
      company_name
    );
    res.status(200).json(updateUser);
  } catch (err) {
    next(err);
  }
};

const updateAbout = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { about } = req.body;
    const updateUser = await userService.updateAbout(userId, about);
    res.status(200).json(updateUser);
  } catch (err) {
    next(err);
  }
};

const getTalentsByLevel = async (req, res, next) => {
  try {
    const { levelId } = req.params;
    const users = await userService.findTalentsByLevel(levelId);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getAllTalents = async (req, res, next) => {
  try {
    const talents = await userService.getAllTalents();
    res.status(200).json(talents);
  } catch (err) {
    next(err);
  }
};
const getAllHunters = async (req, res, next) => {
  try {
    const hunters = await userService.getAllHunters();
    res.status(200).json(hunters);
  } catch (err) {
    next(err);
  }
};

const updateCompanyDescription = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { company_description } = req.body;
    const updateUser = await userService.updateCompanyDescription(
      userId,
      company_description
    );
    res.status(200).json(updateUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserById,
  updateProfilePicture,
  updateUserInfo,
  updateAbout,
  getTalentsByLevel,
  getAllTalents,
  getAllHunters,
  updateCompanyDescription
};
