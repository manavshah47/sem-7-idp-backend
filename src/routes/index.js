// all routes are routed from here
const express = require('express')
const router = express.Router()

// individual route files import
const adminRoute = require("./admin.route")
const employeeRoute = require("./employee.route")
const memberRoute = require("./member.route")
const membershipRoute = require("./membership.route")
const chatRoute = require("./chat.route")
const authRoute = require("./auth.route")
const messageRoute = require("./message.route")
const magazineRoute = require("./magazine.route")
const labRoute = require("./lab.route")

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

// use /chat for chat routes
router.use("/chat", messageRoute)

// use /magazine for magazine routes
router.use("/magazine", magazineRoute)

// use /lab for lab routes
router.use("/lab", labRoute)

module.exports = router