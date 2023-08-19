// express import and router initialization
const express = require("express");
const router = express.Router()

// controller import
const { chatController } = require("../controller");
const { ensureMember } = require("../middleware/user.middleware");

// 1. sign up chat route
router.post('/sign-up', ensureMember, chatController.SignUp)

// 2. login chat controller
router.post('/login', ensureMember, chatController.Login)

module.exports = router;