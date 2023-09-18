const mongoose = require("mongoose")
const { Chat, Message } = require("../models")
const { Member } = require("../models/member.model")
const { emitSocketEvent } = require("../socket/index.js");
const { ChatEventEnum } = require("../constants")


/**
 * @description Utility function which returns the pipeline stages to structure the chat schema with common lookups
 * @returns {mongoose.PipelineStage[]}
 */
const chatCommonAggregation = () => {
  return [
    {
      // lookup for the participants present
      $lookup: {
        from: "members",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            },
          },
        ],
      },
    },
    {
      // lookup for the group chats
      $lookup: {
        from: "messages",
        foreignField: "_id",
        localField: "lastMessage",
        as: "lastMessage",
        pipeline: [
          {
            // get details of the sender
            $lookup: {
              from: "members",
              foreignField: "_id",
              localField: "sender",
              as: "sender",
              pipeline: [
                {
                  $project: {
                    firstName: 1,
                    phone: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              sender: { $first: "$sender" },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        lastMessage: { $first: "$lastMessage" },
      },
    },
  ];
};

/**
 *
 * @param {string} chatId
 * @description utility function responsible for removing all the messages and file attachments attached to the deleted chat
 */
const deleteCascadeChatMessages = async (chatId) => {
    try {
        // delete all the messages
        await Message.deleteMany({
          chat: new mongoose.Types.ObjectId(chatId),
        });
    } catch (error) {
        return { success: false, message : "Internal server error"}
    }
};

const searchAvailableUsers = async (user) => {
    try {
        const users = await Member.find({
            phone: {
              $ne: user.phone, // avoid logged in user
            },
            isApproved: true
        });
        return { success: true, message: "Users fetched successfully", users}
    } catch (error) {
        return { success: false, message : "Internal server error", data: error.message}
    }
};


const createOrGetAOneOnOneChat = async (params, user, req) => {
    try {
        const { receiverPhone } = params;
        
        // Check if it's a valid receiver
        const receiver = await Member.findOne({phone:receiverPhone});
        
        if (!receiver) {
            return { success: false, message: "Receiver does not exists"}
        }

        // check if receiver is not the user who is requesting a chat
        if (receiver.phone === user.phone) {
            return {success: false , message:"You cannot chat with yourself"}
        }
        
        const chat = await Chat.aggregate([
        {
            $match: {
                isGroupChat: false, // avoid group chats. This controller is responsible for one on one chats
                // Also, filter chats with participants having receiver and logged in user only
                $and: [
                    {
                        participants: { $elemMatch: { $eq: user._id } },
                    },
                    {
                        participants: {
                            $elemMatch: { $eq: new mongoose.Types.ObjectId(receiver._id) },
                        },
                    },
                ],
            },
        },
        ...chatCommonAggregation(),
        ]);


    if (chat.length) {
        // if we find the chat that means user already has created a chat
        return { success: false, message: "Chat with user already exists", chat: chat[0]}
    }

    // if not we need to create a new one on one chat
    const newChatInstance = await Chat.create({
        name: "One on one chat",
        participants: [user._id, new mongoose.Types.ObjectId(receiver._id)], // add receiver and logged in user as participants
        admin: user._id,
    });

    // structure the chat as per the common aggregation to keep the consistency
    const createdChat = await Chat.aggregate([
        {
            $match: {
                _id: newChatInstance._id,
            },
        },
        ...chatCommonAggregation(),
    ]);

    const payload = createdChat[0]; // store the aggregation result

    if (!payload) {
        return { success: false, message: "Internal server error" }
    }

    // logic to emit socket event about the new chat added to the participants
    payload?.participants?.forEach((participant) => {
        if (participant.phone === user.phone) return; // don't emit the event for the logged in use as he is the one who is initiating the chat

        // emit event to other participants with new chat as a payload
        emitSocketEvent(
            req,
            participant._id?.toString(),
            ChatEventEnum.NEW_CHAT_EVENT,
            payload
        );
    });

    return { success: true, message: "Chat retrieved successfully", chat: payload }
    
    } catch (error) {
        return { success: false, message: "Internal server error", data: error.message}
    }
};


const createAGroupChat = async (body, user, req) => {
    try {

        const { name, participants } = body;

        // Check if user is not sending himself as a participant. This will be done manually
        if (participants.includes(user._id.toString())) {
            return { success: false, message: "Participants array should not contain the group creator"}
        }

        const members = [...new Set([...participants, user._id.toString()])]; // check for duplicates

        if (members.length < 3) {
            // check after removing the duplicate
            // We want group chat to have minimum 3 members including admin
            return { success: true, message: "Seems like you have passed duplicate participants." }
        }

        // Create a group chat with provided members
        const groupChat = await Chat.create({
            name,
            isGroupChat: true,
            participants: members,
            admin: user._id,
        });

        // structure the chat
        const chat = await Chat.aggregate([
            {
            $match: {
                _id: groupChat._id,
            },
            },
            ...chatCommonAggregation(),
        ]);

        const payload = chat[0];

        if (!payload) {
            return { success: false, message: "Internal server error" }
        }

        // logic to emit socket event about the new group chat added to the participants
        payload?.participants?.forEach((participant) => {
            if (participant._id.toString() === req.user._id.toString()) return; // don't emit the event for the logged in use as he is the one who is initiating the chat
            // emit event to other participants with new chat as a payload
            emitSocketEvent(
            req,
            participant._id?.toString(),
            ChatEventEnum.NEW_CHAT_EVENT,
            payload
            );
        });

        return { success: true, message: "Group chat created successfully" }
    } catch (error) {
        return {success: false, message:"Internal server error"}
    }
};


const getGroupChatDetails = async (params) => {
    try {
        const { chatId } = params;
        const groupChat = await Chat.aggregate([
            {
            $match: {
                _id: new mongoose.Types.ObjectId(chatId),
                isGroupChat: true,
            },
            },
            ...chatCommonAggregation(),
        ]);
    
        const chat = groupChat[0];
    
        if (!chat) {
            return { success: false, message: "Group chat does not exist" }
        }
    
        return { success: true, message: "Group chat fetched successfully", chat }
    } catch (error) {
        return { success: false, message: "Internal server error"}
    }
};


const renameGroupChat = async (params, body, user, req) => {
    try {
    const { chatId } = params;
    const { name } = body;

    // check for chat existence
    const groupChat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
    });

    if (!groupChat) {
        return { success: false, message: "Group chat does not exists" }
    }

    // only admin can change the name
    if (groupChat.admin?.toString() !== user._id?.toString()) {
        return { success: false, message: "You are not an admin" }
    }

    const updatedGroupChat = await Chat.findByIdAndUpdate(
        chatId,
        {
        $set: {
            name,
        },
        },
        { new: true }
    );

    const chat = await Chat.aggregate([
        {
        $match: {
            _id: updatedGroupChat._id,
        },
        },
        ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
        return { success: false, message: "Internal server error" }
    }

    // logic to emit socket event about the updated chat name to the participants
    payload?.participants?.forEach((participant) => {
        // emit event to all the participants with updated chat as a payload
        emitSocketEvent(
        req,
        participant._id?.toString(),
        ChatEventEnum.UPDATE_GROUP_NAME_EVENT,
        payload
        );
    });

    return { success: true, message: "Group chat name updated successfully", chat: chat[0] }

    } catch (error) {
        return { success: false, message: "Internal server error" }
    }
};


const deleteGroupChat = async (params, user, req) => {
    try {
    const { chatId } = params;

    // check for the group chat existence
    const groupChat = await Chat.aggregate([
        {
        $match: {
            _id: new mongoose.Types.ObjectId(chatId),
            isGroupChat: true,
        },
        },
        ...chatCommonAggregation(),
    ]);

    const chat = groupChat[0];

    if (!chat) {
        return { success: false, message: "Group chat does not exists" }
    }

    // check if the user who is deleting is the group admin
    if (chat.admin?.toString() !== user._id?.toString()) {
        return { sucess: false, message: "Only admin can delete the group" }
    }

    await Chat.findByIdAndDelete(chatId); // delete the chat

    await deleteCascadeChatMessages(chatId); // remove all messages and attachments associated with the chat

    // logic to emit socket event about the group chat deleted to the participants
    chat?.participants?.forEach((participant) => {
        if (participant._id.toString() === user._id.toString()) return; // don't emit the event for the logged in use as he is the one who is deleting
        // emit event to other participants with left chat as a payload
        emitSocketEvent(
        req,
        participant._id?.toString(),
        ChatEventEnum.LEAVE_CHAT_EVENT,
        chat
        );
    });

    return { success: true, messsage: "Group chat deleted successfully" }
    } catch (error) {
        return { success: false, message: "Internal server error" }
    }
};


const deleteOneOnOneChat = async (params, user, req) => {
    try { 
    const { chatId } = params;

    // check for chat existence
    const chat = await Chat.aggregate([
        {
        $match: {
            _id: new mongoose.Types.ObjectId(chatId),
        },
        },
        ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
        return { success: false, message: "Chat does not exists" }
    }

    await Chat.findByIdAndDelete(chatId); // delete the chat even if user is not admin because it's a personal chat

    await deleteCascadeChatMessages(chatId); // delete all the messages and attachments associated with the chat

    const otherParticipant = payload?.participants?.find(
        (participant) => participant?.phone !== user.phone // get the other participant in chat for socket
    );

    // emit event to other participant with left chat as a payload
    emitSocketEvent(
        req,
        otherParticipant._id?.toString(),
        ChatEventEnum.LEAVE_CHAT_EVENT,
        payload
    );

    return { success: true, message: "chat deleted successfully" }
    } catch (error) {
        return { success: false, message: "Internal server error" }
    }
};


const leaveGroupChat = async (params, user) => {
    try {
    const { chatId } = params;

    // check if chat is a group
    const groupChat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
    });

    if (!groupChat) {
        return { success: false, message: "Group chat does not exists" }
    }

    const existingParticipants = groupChat.participants;

    // check if the participant that is leaving the group, is part of the group
    if (!existingParticipants?.includes(user?._id)) {
        return { sucess: false, message: "You are not a part of this group chat" }
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
        $pull: {
            participants: user?._id, // leave the group
        },
        },
        { new: true }
    );

    const chat = await Chat.aggregate([
        {
        $match: {
            _id: updatedChat._id,
        },
        },
        ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
        return { success: false, message: "Internal server error" }
    }

    return { sucess: true, message: "Left a group successfully", payload }
    } catch (error) {
        return { success: false, message: "Internal server error" }
    }
};


const addNewParticipantInGroupChat = async (params, user, req) => {
    try {
    const { chatId, participantId } = params;

    // check if chat is a group
    const groupChat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
    });

    if (!groupChat) {
        return { success: false, message: "Group chat does not exist" }
    }

    // check if user who is adding is a group admin
    if (groupChat.admin?.toString() !== user._id?.toString()) {
        return { success: false, message: "You are not an admin" }
    }

    const existingParticipants = groupChat.participants;

    // check if the participant that is being added in a part of the group
    if (existingParticipants?.includes(participantId)) {
        return { success: false, message: "Participant already in a group chat" }
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
        $push: {
            participants: participantId, // add new participant id
        },
        },
        { new: true }
    );

    const chat = await Chat.aggregate([
        {
        $match: {
            _id: updatedChat._id,
        },
        },
        ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
        return { success: false, message: "Internal server error" }
    }

    // emit new chat event to the added participant
    emitSocketEvent(req, participantId, ChatEventEnum.NEW_CHAT_EVENT, payload);

    return { success: true, message: "Participant added successfully", payload }
    }catch(error) {
        return { success: false, message: "Internal server error" }
    }
};


const removeParticipantFromGroupChat = async (params, user, req) => {
    try {

    const { chatId, participantId } = params;

    // check if chat is a group
    const groupChat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
    });

    if (!groupChat) {
        return { success: false, message: "Group chat does not exists" }
    }

    // check if user who is deleting is a group admin
    if (groupChat.admin?.toString() !== user._id?.toString()) {
        return { success:false, message: "You are not an admin" }
    }

    const existingParticipants = groupChat.participants;

    // check if the participant that is being removed in a part of the group
    if (!existingParticipants?.includes(participantId)) {
        return { success: false, message: "Participant does not exist in the group chat" }
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
        $pull: {
            participants: participantId, // remove participant id
        },
        },
        { new: true }
    );

    const chat = await Chat.aggregate([
        {
        $match: {
            _id: updatedChat._id,
        },
        },
        ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
        return { success: false, message: "Internal server error" }
    }

    // emit leave chat event to the removed participant
    emitSocketEvent(req, participantId, ChatEventEnum.LEAVE_CHAT_EVENT, payload);

    return {success: true, message: "Participant removed successfully"}
    } catch (error){
        return { success:false, message: "Internal server error" }
    }
};


const getAllChats = async (user) => {
    try { 
        const chats = await Chat.aggregate([
            {
            $match: {
                participants: { $elemMatch: { $eq: user._id } }, // get all chats that have logged in user as a participant
            },
            },
            {
            $sort: {
                updatedAt: -1,
            },
            },
            ...chatCommonAggregation(),
        ]);

        console.log("chats: ", chats)
        // start from here
        // chats.forEach((chat) => {
        // })

        return { success: true, message: "User chats fetched successfully", chats }
    } catch (error) {
        return { success: false, message: "Internal server error" }
    }
};

module.exports = {
  addNewParticipantInGroupChat,
  createAGroupChat,
  createOrGetAOneOnOneChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  getAllChats,
  getGroupChatDetails,
  leaveGroupChat,
  removeParticipantFromGroupChat,
  renameGroupChat,
  searchAvailableUsers,
};
