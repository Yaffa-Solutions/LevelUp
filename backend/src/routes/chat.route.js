const express = require('express');
const { createChat,deleteChat, getChatsByUserId, getCurrentUser } = require('../controllers/chat/Chat.controller');
const { addMessage, getMessages, deleteMessage } = require('../controllers/chat/Message.controller');
const { startChatBot, sendMessageToChatBot } = require('../controllers/chat/AIBot.controller');
const router=express.Router()

router.post('/chat',createChat)
router.delete('/chat/:id',deleteChat)
router.get('/chat/:user_id',getChatsByUserId)
router.get('/user/:user_id',getCurrentUser)
// Messages
router.post('/message',addMessage)
router.get('/message/:chat_id',getMessages)
router.delete('/message/:id',deleteMessage)

//Chatbot
router.post('/startChatBot',startChatBot)
router.post('/sendMessageToAI',sendMessageToChatBot)
module.exports=router