const mongoose = require("mongoose")
const { Chat, Message } = require("../models")
const { emitSocketEvent } = require("../socket/index.js");
const { ChatEventEnum } = require("../constants");
const { uploadPDFFile, uploadImageFile, getPDFSignedURL, getImageSignedUrl } = require("./image.service");

// bluebird promise - used for asynchronous promise handling while uploading multiple files in s3 at same time
const Promise = require('bluebird')


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

    await Promise.map(messages, async (message, index) => {
        if(message.attachment){
            let attachmentURL = ""
            if (message.attachment.type == "pdf") {
                attachmentURL = await getPDFSignedURL(message.attachment.url)
            } else if(message.attachment.type == "image"){
                attachmentURL = await getImageSignedUrl(message.attachment.url)
            }
            messages[index].attachment.url = attachmentURL
        }
        return 
    }, {concurrency: 4})

    return { success: true, message: "Messages fetched successfully", messages }
    } catch (error) {
        return { success:false, message: "Internal server error", data: error.message }
    }
};

const sendMessage = async (params, body, user, files, req) => {
    try {
    const { chatId } = params;
    const { content } = body;

    console.log("FILES: ", files)

    if (!content && !files) {
        return { success: false, message: "Message content is required" }
    }

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
        return { success: false, message: "Chat does not exists" }
    }

    let attachment = {}

    if(files) {
        if(files.file.mimetype == "application/pdf"){
            let temp = await uploadPDFFile(files, "chat")
            attachment = {
                url : temp,
                type: "pdf"
            }
        } else {
            let temp = await uploadImageFile(files, "chat")
            attachment = {
                url : temp,
                type: "image"
            }
        }
    }

    // Create a new message instance with appropriate metadata
    const message = await Message.create({
        sender: new mongoose.Types.ObjectId(user._id),
        content: content || "",
        chat: new mongoose.Types.ObjectId(chatId),
        attachment
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


    // if message is having a attachment then send signed url of attachent with response
    if(receivedMessage.attachment) {
        if(receivedMessage.attachment.type == "image") {
            receivedMessage.attachment.url = await getImageSignedUrl(receivedMessage.attachment.url)
        } else if (receivedMessage.attachment.type == "pdf") {
            receivedMessage.attachment.url = await getPDFSignedURL(receivedMessage.attachment.url)
        }
    }

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
