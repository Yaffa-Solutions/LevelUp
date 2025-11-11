const experienceService = require('../services/experienceService.js');

const getTalentExperiences = async (req, res, next) => {
  try {
    // const { userId } = req.params;
    const userId = req.user?.userId;
    const talentExperiences = await experienceService.getTalentExperiences(
      userId
    );
    res.status(200).json(talentExperiences);
  } catch (err) {
    next(err);
  }
};

const addNewExperience = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const {
      company_name,
      position,
      start_date,
      end_date,
      description,
      employment_type,
    } = req.body;

    if (!userId || !company_name || !position || !start_date) {
      return res.status(400).json({
        error: 'user_id, company_name, position and start_date are required',
      });
    }

    const created = await experienceService.addNewExperience(
      userId,
      company_name,
      position,
      start_date,
      end_date,
      description,
      employment_type
    );
    res.status(200).json(created);
  } catch (err) {
    next(err);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      company_name,
      position,
      start_date,
      end_date,
      description,
      employment_type,
    } = req.body;
    console.log('Updating experience:', req.params.id, req.body);
    const updated = await experienceService.updateExperience(
      id,
      company_name,
      position,
      start_date,
      end_date,
      description,
      employment_type
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
     if (!id) {
       return res.status(400).json({ error: 'id is required' });
     }
    await experienceService.deleteExperience(id);
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTalentExperiences,
  addNewExperience,
  updateExperience,
  deleteExperience,
};