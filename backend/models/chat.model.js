import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }],
    resumes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume"
    }],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;