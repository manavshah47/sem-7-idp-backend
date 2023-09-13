const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat