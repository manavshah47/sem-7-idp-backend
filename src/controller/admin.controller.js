// import admin services
const {adminService} = require("../services")

// login admin controller
const logIn = async (req,res) => {
    const adminLogInMessage =  await adminService.logIn(req.user)
    res.json(adminLogInMessage)
}

// show-admin-info controller
const showAdminInfo = async (req, res) => {
    const adminInfo = await adminService.showAdminInfo(req.user)
    res.json(adminInfo)
}

// logout admin controller
const LogOut = async (req, res) => {
    const logOutResponse = await adminService.logOut(req.session)
    res.json(logOutResponse)
}

// create user controller
const createUser = async (req, res) => {
    const createdUserResponse = await adminService.createUser(req.body)
    res.json(createdUserResponse)
}

// show users controller
const showUsers = async (req, res) => {
    const usersInfo = await adminService.showUsers(req.query)
    res.json(usersInfo)
}

// delete user controller
const deleteUser = async (req, res) => {
    const deletedUserInfo = await adminService.deleteUser(req.params)
    res.json(deletedUserInfo)
}

// update user controller
const updateUser = async (req, res) => {
    const updatedUserInfo = await adminService.updateUser(req.body)
    res.json(updatedUserInfo)
}

const checkPhoneExist = async(req,res) => {
    const checkphone = await adminService.checkPhoneExist(req.params)
    res.json(checkphone)
}

const checkEmailExist = async(req,res) => {
    const checkemail = await adminService.checkEmailExist(req.params)
    res.json(checkemail)
}


module.exports = {
    logIn,
    showAdminInfo,
    LogOut,
    createUser,
    showUsers,
    deleteUser,
    updateUser,
    checkEmailExist,
    checkPhoneExist
}