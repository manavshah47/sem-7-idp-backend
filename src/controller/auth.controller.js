const { authService } = require("../services")

// login user controller
const login = async (req, res) => {
    const loginMessage = await authService.login(req.user)
    res.json(loginMessage)
}

// logout user controller
const logout = async (req, res) => {
    const logoutUserResponse = await authService.logout(req.session)
    res.json(logoutUserResponse)
}

// send otp request
const sendOtp = async (req, res) => {
    const otpResponse = await authService.sendOtp(req.body)
    res.json(otpResponse)
}

const checkPhoneExist = async(req,res) => {
    const checkphone = await authService.checkPhoneExist(req.params)
    res.json(checkphone)
}

const checkEmailExist = async(req,res) => {
    const checkemail = await authService.checkEmailExist(req.params)
    res.json(checkemail)
}

const showUserData = async (req, res) => {
    const userDataResponse = await authService.showUserData(req.user)
    res.json(userDataResponse)
}

module.exports = {
    login,
    logout,
    sendOtp,
    checkPhoneExist,
    checkEmailExist,
    showUserData
}