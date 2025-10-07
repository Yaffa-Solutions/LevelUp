const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

const main = async () =>{
  const levels = await Promise.all([
    prisma.UserLevels.create({ data: { name: 'Fresher' } }),
    prisma.UserLevels.create({ data: { name: 'Junior' } }),
    prisma.UserLevels.create({ data: { name: 'Mid' } }),
    prisma.UserLevels.create({ data: { name: 'Senior' } }),
  ])

  const skills = await Promise.all([
    prisma.Skill.create({ data: { skill_name: 'JavaScript' } }),
    prisma.Skill.create({ data: { skill_name: 'Python' } }),
    prisma.Skill.create({ data: { skill_name: 'React' } }),
  ])

  const users = await Promise.all([
    prisma.User.create({
      data: {
        email: 'talent1@example.com',
        password: await bcrypt.hash('password1', 10),
        first_name: 'Alice',
        last_name: 'Smith',
        role: 'TALENT',
        level_id: levels[0].id,
        is_verified: true,
      }
    }),
    prisma.User.create({
      data: {
        email: 'hunter1@example.com',
        password: await bcrypt.hash('password2', 10),
        first_name: 'Bob',
        last_name: 'Johnson',
        role: 'HUNTER',
        level_id: levels[1].id,
        is_verified: true,
      }
    })
  ])

  await prisma.SkillTalent.createMany({
    data: [
      { user_id: users[0].id, skill_id: skills[0].id },
      { user_id: users[0].id, skill_id: skills[1].id },
    ]
  })

  await prisma.Plan.create({
    data: {
      user_id: users[0].id,
      plan_name: 'Starter Plan',
      active: true,
      started_time: new Date(),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      content: 'Learn basics of JS',
      level_id: levels[0].id
    }
  })

  await prisma.Experience.create({
    data: {
      user_id: users[0].id,
      company_name: 'Company A',
      position: 'Intern',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-06-01'),
      description: 'Worked on frontend tasks',
      employment_type: 'INTERN'
    }
  })

  const jobs = await prisma.Job.create({
    data: {
      hunter_id: users[1].id,
      meta_data: { title: 'Frontend Developer', description: 'React project' }
    }
  })

  await prisma.JobApplication.create({
    data: {
      job_id: jobs.id,
      talent_id: users[0].id,
      status: 'ACCEPTED'
    }
  })

  console.log('Database seeded successfully')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
