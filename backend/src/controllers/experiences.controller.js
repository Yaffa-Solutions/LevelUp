const prisma = require('../prismaClient.js');

const getTalentExperiences = (req, res, next) => {
  const { userId } = req.params;

  prisma.experience
    .findMany({
      where: { user_id: userId },
      orderBy: { start_date: 'desc' },
    })
    .then((exp) => {
      if (!exp)
        return res
          .status(404)
          .json({ error: 'User doesnt have any experiences yet!' });
      res.status(200).json(exp);
    })
    .catch(next);
};

const addNewExperience = (req, res, next) => {
  const {
    user_id,
    company_name,
    position,
    start_date,
    end_date,
    description,
    employment_type,
  } = req.body;

  if (!user_id || !company_name || !position || !start_date) {
    return res.status(400).json({
      error: 'user_id, company_name, position and start_date are required',
    });
  }

  prisma.experience
    .create({
      data: {
        user_id,
        company_name,
        position,
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : null,
        description: description || '',
        employment_type: employment_type || '',
      },
    })
    .then((created) => res.status(201).json(created))
    .catch((err) => next(err));
};

const updateExperience = (req, res, next) => {
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

  prisma.experience
    .update({
      where: { id },
      data: {
        company_name,
        position,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        description,
        employment_type,
      },
    })
    .then((updated) => res.json(updated))
    .catch((err) => next(err));
};

const deleteExperience = (req, res, next) => {
  const { id } = req.params;

  prisma.experience
    .delete({ where: { id } })
    .then(() => res.status(204).send())
    .catch((err) => next(err));
};

module.exports = {
  getTalentExperiences,
  addNewExperience,
  updateExperience,
  deleteExperience,
};
