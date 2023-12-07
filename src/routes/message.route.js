// express import and router initialization
const express = require("express");
const router = express.Router()

// controller import
const { messageController } = require("../controller");
const { ensureMember } = require("../middleware/user.middleware");

// 1. search available users
router.post('/send-message/:chatId', ensureMember, messageController.sendMessage)

// 2. get all messages
router.get("/get-chat-messages/:chatId", ensureMember, messageController.getAllMessages)

module.exports = router;