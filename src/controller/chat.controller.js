const { chatService } = require("../services")

const SignUp = async (req, res) => {
    const signUpResponse = await chatService.SignUp(req.body)
    res.json(signUpResponse)
}

const Login = async (req, res) => {
    const loginResponse = await chatService.Login(req.body)
    res.json(loginResponse)
}

module.exports = { 
    Login,
    SignUp
}