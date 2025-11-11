const { PrismaClient } = require("../../generated/prisma");
const { CustomError } = require("../../middleware/error.middleware");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5432/levelup?schema=public",
    },
  },
});

const createChatService = (chatData) => {
  return prisma.chat
    .findFirst({
      where: {
        OR: [
          { user1_id: chatData.user1_id, user2_id: chatData.user2_id },
          { user1_id: chatData.user2_id, user2_id: chatData.user1_id },
        ],
      },
    })
    .then((existingChat) => {
      if (existingChat) {
        return Promise.reject(
          new CustomError("There is already chat between these users", 400)
        );
      }
      return prisma.chat.create({
        data: {
          type: chatData.type,
          user1_id: chatData.user1_id,
          user2_id: chatData.user2_id,
        },
      });
    });
};

const deleteChatService = async (chat_id) => {
  const existingChat = await prisma.chat.findFirst({
    where: { id: chat_id },
  });

  if (!existingChat) {
    throw new CustomError("No chat has this id", 400);
  }

  await prisma.message.deleteMany({
    where: { chat_id: chat_id },
  });

  const deletedChat = await prisma.chat.delete({
    where: { id: chat_id },
  });

  return deletedChat;
};

const getChatsByUserIdService = async (userId) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new CustomError("No user has this id", 400);
  }

  const userChat = await prisma.chat.findFirst({
    where: {
      OR: [{ user1_id: userId }, { user2_id: userId }],
    },
  });
  if (!userChat) {
    throw new CustomError("this user doesn't have any chats", 400);
  }

  return await prisma.chat.findMany({
    where: {
      OR: [{ user1_id: userId }, { user2_id: userId }],
    },
    include: {
      user1: {
        select: {
          id: true,
          profil_picture: true,
          role: true,
          first_name: true,
          last_name: true,
        },
      },
      user2: {
        select: {
          id: true,
          profil_picture: true,
          role: true,
          first_name: true,
          last_name: true,
        },
      },
      messages: {
        take: 1,
        orderBy: {
          created_at: "desc",
        },
        select: {
          content: true,
        },
      },
    },
  });
};


//I think will remove it because data of user will be sharable in next
const getCurrentUserService = async (userId) => {
  return await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      profil_picture: true,
    },
  });
};

module.exports = {
  createChatService,
  deleteChatService,
  getChatsByUserIdService,
  getCurrentUserService,
};
