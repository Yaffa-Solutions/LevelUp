const { PrismaClient } = require("../../generated/prisma");
const { CustomError } = require("../../middleware/error.middleware");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5432/levelup?schema=public",
    },
  },
});

const addMessageService = async (messageData) => {
  const chat = await prisma.chat.findFirst({
    where: {
      id: messageData.chat_id,
    },
  });
  if (!chat) {
    throw new CustomError("No chat has this id", 400);
  }

  const user = await prisma.chat.findFirst({
    where: {
      OR: [
        { user1_id: messageData.sender_id },
        { user2_id: messageData.sender_id },
      ],
    },
  });

  if (!user) {
    throw new CustomError("No User has this id", 400);
  }

  const message = await prisma.message.create({
    data: {
      sender_id: messageData.sender_id,
      chat_id: messageData.chat_id,
      content: messageData.content,
      content_type: messageData.content_type,
    },
  });
  return message;
};

const getMessagesChatIdService = async (chatId) => {
  const chat = await prisma.chat.findFirst({
    where: {
      id:chatId,
    },
  });
  if (!chat) {
    throw new CustomError("No chat has this id", 400);
  }

  return await prisma.message.findMany({
    where: {
      chat_id: chatId,
    },
  });
};

const deleteMessageService=async (messageId)=>{
    const message=await prisma.message.findFirst({
        where:{
            id:messageId
        }
    })

    if(!message){
        throw new CustomError("No Message has this id", 400);
    }

    return await prisma.message.delete({
        where:{
            id:messageId
        }
    })
}


module.exports = { addMessageService, getMessagesChatIdService,deleteMessageService };
