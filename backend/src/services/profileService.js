const { prisma } = require("../config/db");

const updateProfilePicture = async (userId, imageUrl) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { profile_picture: imageUrl },
  });

  return updatedUser;
};

module.exports = { updateProfilePicture };
