const mongoose = require("mongoose")
const { Chat, Message } = require("../models")
const { emitSocketEvent } = require("../socket/index.js");
const { ChatEventEnum } = require("../constants")


/**
 * @description Utility function which returns the pipeline stages to structure the chat message schema with common lookups
 * @returns {mongoose.PipelineStage[]}
 */
const chatMessageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "members",
        foreignField: "_id",
        localField: "sender",
        as: "sender",
        pipeline: [
          {
            $project: {
              firstName: 1,
              phone: 1
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
  ];
};


const getAllMessages = async (params, user) => {
    try {

    const { chatId } = params;

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
        return { success: false, message: "Chat does not exists" }
    }

    // Only send messages if the logged in user is a part of the chat he is requesting messages of
    if (!selectedChat.participants?.includes(user?._id)) {
        return { success: false, message: "User is not a part of this chat" }
    }

    const messages = await Message.aggregate([
        {
            $match: {
                chat: new mongoose.Types.ObjectId(chatId),
            },
        },
        {
            $sort: {
                createdAt: 1,
            }
        },
        ...chatMessageCommonAggregation(),
    ]);

    return { success: true, message: "Messages fetched successfully", messages }
    } catch (error) {
        return { success:false, message: "Internal server error", data: error.message }
    }
};

const sendMessage = async (params, body, user, req) => {
    try {
    const { chatId } = params;
    const { content } = body;

    if (!content) {
        return { success: false, message: "Message content is required" }
    }

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
        return { success: false, message: "Chat does not exists" }
    }

    // Create a new message instance with appropriate metadata
    const message = await Message.create({
        sender: new mongoose.Types.ObjectId(user._id),
        content: content || "",
        chat: new mongoose.Types.ObjectId(chatId)
    });

    // update the chat's last message which could be utilized to show last message in the list item
    const chat = await Chat.findByIdAndUpdate(
        chatId,
        {
        $set: {
            lastMessage: message._id,
        },
        },
        { new: true }
    );

    // structure the message
    const messages = await Message.aggregate([
        {
        $match: {
            _id: new mongoose.Types.ObjectId(message._id),
        },
        },
        ...chatMessageCommonAggregation(),
    ]);

    // Store the aggregation result
    const receivedMessage = messages[0];

    if (!receivedMessage) {
        return { success:false, message: "Internal server error" }
    }

    // logic to emit socket event about the new message created to the other participants
    chat.participants.forEach((participantObjectId) => {
        // here the chat is the raw instance of the chat in which participants is the array of object ids of users
        // avoid emitting event to the user who is sending the message
        if (participantObjectId.toString() === req.user._id.toString()) return;
        
        // emit the receive message event to the other participants with received message as the payload
        emitSocketEvent(
            req,
            participantObjectId.toString(),
            ChatEventEnum.MESSAGE_RECEIVED_EVENT,
            receivedMessage
            );
        });
        
        return { success: true, message: "Message saved successfully", message:receivedMessage }
    } catch(error) {
        return { success:false, message: "Internal server error", data: error.message }
    }
};

module.exports =  { getAllMessages, sendMessage };
