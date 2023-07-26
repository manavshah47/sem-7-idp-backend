const { employeeService } = require("../services")

// login user controller
const login = async (req, res) => {
    const loginMessage = await employeeService.login(req.user)
    res.json(loginMessage)
}

// show user info controller
const showUserInfo = async (req, res) => {
    const userInfo = await employeeService.showUserInfo(req.user)
    res.json(userInfo)
}

// logout user controller
const logout = async (req, res) => {
    const logoutUserResponse = await employeeService.logout(req.session)
    res.json(logoutUserResponse)
}

// error page just to show user not exists with given user credentials
const errorPage = async (req, res) => {
    const errorPageResponse = await employeeService.errorPage()
    res.json(errorPageResponse)
}

module.exports = {
    login,
    showUserInfo,
    logout,
    errorPage
}