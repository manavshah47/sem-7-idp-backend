const mongoose = require("mongoose");

// TODO: Add image and pdf file sharing in the next version
const chatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    content: {
      type: String,
    },
    attachment: {
      type: {
        type: String,
      },
      url : {
        type: String
      }
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = Message