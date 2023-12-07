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

const adminDashboardData = async (req, res) => {
    const dashboardDataResponse = await adminService.adminDashboardData()
    res.json(dashboardDataResponse)
}

module.exports = {
    logIn,
    showAdminInfo,
    createUser,
    showUsers,
    deleteUser,
    updateUser,
    adminDashboardData
}