const prisma = require('../prismaClient.js');

const getHunters = async (req, res, next) => {
  try {
    const hunters = await prisma.user.findMany({
      where: {
        role: { in: ['HUNTER', 'BOTH'] },
      },
      include: {
        levels: true,
      },
    });

    res.status(200).json(hunters);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getHunters
}