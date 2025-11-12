const {
  createChatService,
  deleteChatService,
  getChatsByUserIdService,
  getCurrentUserService,
} = require("../../services/chat/chat.service.js");

const createChat = (req, res, next) => {
  const chatData = req.body;
  if (!chatData || !chatData.user1_id || !chatData.user2_id || !chatData.type) {
    return res.status(400).json({ message: "some data is missing" });
  }

  createChatService(chatData)
    .then((chat) =>
      res
        .status(201)
        .json({ message: "Chat created successfully!", data: chat })
    )
    .catch((err) => next(err));
};

const deleteChat = (req, res, next) => {
  const chat_id = req.params.id;
  console.log({ chat_id });
  if (!chat_id) {
    return res.status(400).json({ message: "chat_id is missing" });
  }
  deleteChatService(chat_id)
    .then((result) => {
      console.log(result);
      res
        .status(200)
        .json({ message: "Chat deleted successfully", data: result });
    })
    .catch((err) => next(err));
};

const getChatsByUserId = ({ params: { user_id } }, res, next) => {
  getChatsByUserIdService(user_id)
    .then((result) => {
      res
        .status(200)
        .json({ message: "Chats retrieved successfully!", data: result });
    })
    .catch((err) => next(err));
};

const getCurrentUser = ({ params: { user_id } }, res, next) => {
  getCurrentUserService(user_id)
    .then((result) => {
      console.log(result);
      res
        .status(200)
        .json({ message: "User retrieved successfully!", data: result });
    })
    .catch((err) => next(err));
};
module.exports = { createChat, deleteChat, getChatsByUserId, getCurrentUser };
