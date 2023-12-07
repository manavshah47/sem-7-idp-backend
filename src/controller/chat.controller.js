const { chatService } = require("../services")

const searchAvailableUsers = async (req, res) => {
    const availableUsersResponse = await chatService.searchAvailableUsers(req.user)
    res.json(availableUsersResponse)
}

const createOrGetAOneOnOneChat = async (req, res) => {
    const chatResponse = await chatService.createOrGetAOneOnOneChat(req.params, req.user, req)
    res.json(chatResponse)
}

const createAGroupChat = async (req, res) => {
    const groupChatResponse = await chatService.createAGroupChat(req.body, req.user, req)
    res.json(groupChatResponse)
}

const getGroupChatDetails = async (req, res) => {
    const groupChatDetailsResponse = await chatService.getGroupChatDetails(req.params)
    res.json(groupChatDetailsResponse)
}

const renameGroupChat = async (req, res) => {
    const renamedGroupChatNameResponse = await chatService.renameGroupChat(req.params, req.body, req.user, req)
    res.json(renamedGroupChatNameResponse)
}

const deleteGroupChat = async (req, res) => {
    const deletedGroupchatResponse = await chatService.deleteGroupChat(req.params, req.user, req)
    res.json(deletedGroupchatResponse)
}

const deleteOneOnOneChat = async (req, res) => {
    const deletedOneToOneChatResponse = await chatService.deleteOneOnOneChat(req.params, req.user, req)
    res.json(deletedOneToOneChatResponse)
}

const leaveGroupChat = async (req, res) => {
    const groupChatLeaveResponse = await chatService.leaveGroupChat(req.params, req.user)
    res.json(groupChatLeaveResponse)
}

const addNewParticipantInGroupChat = async (req, res) => {
    const newParticipantResponse = await chatService.addNewParticipantInGroupChat(req.params, req.user, req)
    res.json(newParticipantResponse)
}

const removeParticipantFromGroupChat = async (req, res) => {
    const removedParticipantResponse = await chatService.removeParticipantFromGroupChat(req.params, req.user, req)
    res.json(removedParticipantResponse)
}

const getAllChats = async (req, res) => {
    const allChatResponse = await chatService.getAllChats(req.user)
    res.json(allChatResponse)
}

module.exports = {
    searchAvailableUsers,
    createOrGetAOneOnOneChat,
    createAGroupChat,
    getGroupChatDetails,
    renameGroupChat,
    deleteGroupChat,
    deleteOneOnOneChat,
    leaveGroupChat, 
    addNewParticipantInGroupChat,
    removeParticipantFromGroupChat,
    getAllChats
}