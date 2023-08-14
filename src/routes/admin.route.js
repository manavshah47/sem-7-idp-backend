// express import and router initialization
const express = require("express");
const router = express.Router()

// controller import
const { adminController } = require("../controller");

// middleware import
const { ensureAdmin } = require("../middleware/admin.middleware")
const { ensureGuest, logoutUser } = require("../middleware/auth.middleware")

// passport import
const passport = require("passport")

// 1. admin login route
router.get("/login", ensureGuest, passport.authenticate('admin', { scope: ['profile','email'] }))

// 2. show admin info route (extra)
router.get("/show-admin-info", ensureAdmin, adminController.showAdminInfo)

// 3. oauth callback route
router.get("/callback", passport.authenticate('admin', { successRedirect:"http://localhost:3000/",failureRedirect: 'http://localhost:3001/admin/error' }), adminController.logIn)

// 4. logout admin route
router.get('/logout', logoutUser, adminController.LogOut)

// 5. create user route
router.post("/create-user", ensureAdmin, adminController.createUser)

// 6. show users (typeOfUser as type in query, page & limit query)
router.get("/show-users", ensureAdmin, adminController.showUsers)

// 7. delete user route
router.delete("/delete-user/:id", ensureAdmin, adminController.deleteUser)

// 8. update user route
router.put("/update-user", ensureAdmin, adminController.updateUser)

// 9. check user exists with given emailId or not
router.post("/check-user-exists", ensureAdmin, adminController.checkExists)

module.exports = router;