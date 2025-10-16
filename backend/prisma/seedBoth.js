// const { PrismaClient } = require('../src/generated/prisma')
// const prisma = new PrismaClient()
// const bcrypt = require('bcrypt')

// const main = async () => {

//   const levels = await prisma.UserLevels.findMany()
//   const skills = await prisma.Skill.findMany()
//   // Users
// //   const  both = await Promise.all([
// //     prisma.User.create({
// //       data: {
// //         email: 'both3@example.com',
// //         password: await bcrypt.hash('password3', 10),
// //         first_name: 'Charlie',
// //         last_name: 'Brown',
// //         role: 'BOTH',
// //         level_id: levels[0]?.id || null,
// //         is_verified: true,
// //       }
// //     })
// //   ])
// const both = await prisma.User.create({
//   data: {
//     email: 'both3@example.com',
//     password: await bcrypt.hash('password3', 10),
//     first_name: 'Charlie',
//     last_name: 'Brown',
//     role: 'BOTH',
//     level_id: levels[2].id,
//     is_verified: true,
//   }
// })


//   // Skill mapping
//   await prisma.SkillTalent.createMany({
//     data: [
//       { user_id: both.id, skill_id: skills[0].id },
//       { user_id: both.id, skill_id: skills[1].id },
//     ]
//   })

//   // Plans
//   await Promise.all([
//     prisma.Plan.create({
//       data: {
//         user_id: both.id,
//         plan_name: 'Advanced Plan',
//         active: true,
//         started_time: new Date(),
//         end_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
//         content: 'Learn React and Python',
//         level_id: levels[2].id
//       }
//     })
//   ])

//   // Experience
//   await Promise.all([
//     prisma.Experience.create({
//       data: {
//         user_id: both.id,
//         company_name: 'Company B',
//         position: 'Developer',
//         start_date: new Date('2023-06-01'),
//         end_date: new Date('2024-01-01'),
//         description: 'Full stack projects',
//         employment_type: 'FULL_TIME'
//       }
//     })
//   ])

//   // Jobs
//   const jobs = await Promise.all([
//     prisma.Job.create({
//       data: {
//         hunter_id: both.id,
//         meta_data: {
//           job_title: 'Python Developer',
//           requirement: {
//             levels: 'Junior',
//             nice_to_have: ['React', 'JavaScript'],
//             description: 'Work on dynamic React components and integrate APIs.'
//           },
//           employment_type: 'FULL_TIME'
//         }
//       }
//     })
//   ])

//   console.log('Seeded TALENT, HUNTER, and BOTH successfully')
// }

// main()
//   .catch(e => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

const main = async () => {
  const levels = await prisma.UserLevels.findMany()
  const skills = await prisma.Skill.findMany()

  const level = levels[2] || levels[0]
  const skill1 = skills[0]
  const skill2 = skills[1] || skills[0]

  const both = await prisma.User.create({
    data: {
      email: 'both3@example.com',
      password: await bcrypt.hash('password3', 10),
      first_name: 'Charlie',
      last_name: 'Brown',
      role: 'BOTH',
      level_id: level.id,
      is_verified: true,
    },
  })

  await prisma.SkillTalent.createMany({
    data: [
      { user_id: both.id, skill_id: skill1.id },
      { user_id: both.id, skill_id: skill2.id },
    ],
  })

  await prisma.Plan.create({
    data: {
      user_id: both.id,
      plan_name: 'Advanced Plan',
      active: true,
      started_time: new Date(),
      end_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      content: 'Learn React and Python',
      level_id: level.id,
    },
  })

  await prisma.Experience.create({
    data: {
      user_id: both.id,
      company_name: 'Company B',
      position: 'Developer',
      start_date: new Date('2023-06-01'),
      end_date: new Date('2024-01-01'),
      description: 'Full stack projects',
      employment_type: 'FULL_TIME',
    },
  })

  await prisma.Job.create({
    data: {
      hunter_id: both.id,
      meta_data: {
        job_title: 'Python Developer',
        requirement: {
          levels: 'Junior',
          nice_to_have: ['React', 'JavaScript'],
          description: 'Work on dynamic React components and integrate APIs.',
        },
        employment_type: 'FULL_TIME',
      },
    },
  })

  console.log('Seeded BOTH user successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
