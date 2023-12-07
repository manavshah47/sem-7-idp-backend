const { messageService } = require("../services")

const getAllMessages = async (req, res) => {
    const allMessageResponse = await messageService.getAllMessages(req.params, req.user)
    res.json(allMessageResponse)
}

const sendMessage = async (req, res) => {
    const sendMessageResponse = await messageService.sendMessage(req.params, req.body, req.user, req.files, req)
    res.json(sendMessageResponse)
}

module.exports = {
    getAllMessages,
    sendMessage
}