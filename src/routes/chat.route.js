// express import and router initialization
const express = require("express");
const router = express.Router()

// controller import
const { chatController } = require("../controller");
const { ensureMember } = require("../middleware/user.middleware");

// 1. search available users
router.post('/search-users', ensureMember, chatController.searchAvailableUsers)

// 2. create or get one to one chat
router.get("/get-one-to-one-chat/:receiverPhone", ensureMember, chatController.createOrGetAOneOnOneChat)

// 3. delete one to one chat
router.delete("/delete-one-to-one-chat/:chatId", ensureMember, chatController.deleteOneOnOneChat)

// 4. all chats of perticular user
router.get("/all-chats", ensureMember, chatController.getAllChats)

module.exports = router;