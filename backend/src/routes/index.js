const express = require('express');

const router = express.Router();
const routerChat = require('../routes/chat.route');

router.use(routerChat)
module.exports=router;