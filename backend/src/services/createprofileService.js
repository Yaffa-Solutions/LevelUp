const prisma = require('../config/db');

const createUserProfile = async (data) =>{
  const {
    userId,
    role,
    firstName,
    lastName,
    about,
    jobTitle,
    companyName,
    companyDesc,
    skills,
    experiences,
    profilePicture,
  } = data;


  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      first_name: firstName,
      last_name: lastName,
      about,
      job_title: jobTitle,
      company_name: companyName,
      company_description: companyDesc,
      profil_picture: profilePicture,
      updated_at: new Date(),
      is_profile_complete: true,
    },
  });

  await prisma.skillTalent.deleteMany({ where: { user_id: userId } });


  for (const skillName of skills) {
    let skill = await prisma.skill.findFirst({ where: { skill_name: skillName } });
    if (!skill) {
      skill = await prisma.skill.create({ data: { skill_name: skillName } });
    }

    await prisma.skillTalent.create({
      data: {
        user_id: userId,
        skill_id: skill.id,
      },
    });
  }

  await prisma.experience.deleteMany({ where: { user_id: userId } });

  for (const exp of experiences) {
    await prisma.experience.create({
      data: {
        user_id: userId,
        company_name: exp.company,
        position: exp.position,
        description: exp.description,
        start_date: new Date(exp.startDate),
        end_date: exp.isCurrent ? new Date() : new Date(exp.endDate),
        // employment_type: exp.employmentType,
        employment_type: exp.employment_type
        ? exp.employment_type.toUpperCase().replace(/\s+/g, '_')
        : 'FULL_TIME',
      },
    });
  }

  return updatedUser;
}

module.exports = { createUserProfile };
