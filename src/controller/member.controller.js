const { memberService } = require("../services")

// login user controller
const login = async (req, res) => {
    const loginMessage = await memberService.login()
    res.json(loginMessage)
}

// show user info controller
const showUserInfo = async (req, res) => {
    const userInfo = await memberService.showUserInfo(req.user)
    res.json(userInfo)
}

// logout user controller
const logout = async (req, res) => {
    const logoutUserResponse = await memberService.logout(req.session)
    res.json(logoutUserResponse)
}

// error page just to show user not exists with given user credentials
const errorPage = async (req, res) => {
    const errorPageResponse = await memberService.errorPage()
    res.json(errorPageResponse)
}

// send otp request
const sendOtp = async (req, res) => {
    const otpResponse = await memberService.sendOtp(req.body)
    res.json(otpResponse)
}

module.exports = {
    login,
    showUserInfo,
    logout,
    errorPage,
    sendOtp
}