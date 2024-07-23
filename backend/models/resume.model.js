import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    chat : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    html : {
      type: String,
      required: true,
    },
    pdf : {
      type: Buffer,
      required: false,
    },
    docx : {
      type: Buffer,
      required: false,
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;