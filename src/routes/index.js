// all routes are routed from here
const express = require('express')
const router = express.Router()

// import admin routes
const adminRoute = require("./admin.route")

// import employee routes
const employeeRoute = require("./employee.route")

// import member routes
const memberRoute = require("./member.route")

// import membership routes
const membershipRoute = require("./membership.route")

// import auth routes
const chatRoute = require("./chat.route")

// import auth routes
const authRoute = require("./auth.route")

const messageRoute = require("./message.route")

// use /admin for admin routes
router.use("/admin", adminRoute)

// use /employee for user routes
router.use("/employee", employeeRoute)

// use /member for user routes
router.use("/member", memberRoute)

// use /membership for user routes
router.use("/membership", membershipRoute)

// use /chat for chat routes
router.use("/chat", chatRoute)

// use /auth for auth routes
router.use("/auth", authRoute)

router.use("/chat", messageRoute)

module.exports = router