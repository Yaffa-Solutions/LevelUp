const {
  addMessageService,
  getMessagesChatIdService,
  deleteMessageService,
} = require("../../services/chat/message.service");

const addMessage = (req, res, next) => {
  const messageData = req.body;
  if (
    !messageData ||
    !messageData.sender_id ||
    !messageData.chat_id ||
    !messageData.content ||
    !messageData.content_type
  ) {
    return res.status(400).json({ message: "some data is missing" });
  }

  addMessageService(messageData)
    .then((result) => {
      console.log(result);
      res
        .status(201)
        .json({ message: "Message created successfully!", data: result });
    })
    .catch((err) => next(err));
};

const getMessages = ({ params: { chat_id } }, res, next) => {
  
  getMessagesChatIdService(chat_id)
    .then((messages) =>
      res
        .status(200)
        .json({ message: "Message retrieved successfully!", data: messages })
    )
    .catch((err) => next(err));
};

const deleteMessage = ({ params: { id } }, res, next) => {
  deleteMessageService(id)
    .then((message) => {
        console.log(message)
      res
        .status(200)
        .json({ message: "Message deleted successfully!", data: message });
    })
    .catch((err) => next(err));
};

module.exports = { addMessage, getMessages, deleteMessage };
