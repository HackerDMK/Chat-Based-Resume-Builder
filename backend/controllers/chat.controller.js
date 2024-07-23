import dotenv from "dotenv";
dotenv.config();
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import Resume from "../models/resume.model.js";
import Anthropic from '@anthropic-ai/sdk';
import htmlDocx from "html-docx-js";

import { generateResumePrompt, getResumeDetailsPrompt } from "../utils/getPrompt.js";
import processHTML from "../utils/processHTML.js";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});


export const startChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;
    const { message } = req.body;

    let chat;
    if (chatId && chatId !== "undefined" && chatId !== "null") {
      chat = await Chat.findById(chatId).populate("messages");
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
    } else {
      chat = new Chat({ user: userId, messages: [] });
      await chat.save();
    }

    const newMessage = new Message({
      chat: chat._id,
      user: userId,
      role: "user",
      content: message,
    });
    await newMessage.save();
    chat.messages.push(newMessage);
    await chat.save();

    const messages = chat.messages;

    let AnthropicResponse = "";

    const prompt = getResumeDetailsPrompt();

    const systemMessage = new Message({
      role: "system",
      content: prompt,
    });

    const stream = anthropic.messages.stream({
      model: "claude-3-5-sonnet-20240620",
      system: systemMessage.content,
      max_tokens: 1000,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    for await (const event of stream) {
      if (event.type === 'message_start') {
        res.write(`event: chatId\ndata: ${chat._id}\n\n`);
      }
      if (event.type === 'content_block_delta') {
        res.write(`data: ${JSON.stringify(event.delta)}\n\n`);
        AnthropicResponse += event.delta.text;
      }
      if (event.type === 'content_block_stop') {
        const assistantMessage = new Message({
          chat: chat._id,
          user: userId,
          role: "assistant",
          content: AnthropicResponse,
        });
        assistantMessage.save().then(() => {
          chat.messages.push(assistantMessage);
          return chat.save();
        }).catch(error => console.error("Error saving assistant message:", error));
        event.done = true;
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        res.end();
      }
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });

  };
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;
    if (!chatId || chatId === "undefined" || chatId === "null") {
      return res.status(400).json({ error: "Chat ID is required" });
    }
    const chat = await Chat.findOne({ user: userId, _id: chatId }).populate("messages");
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json(chat);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const generateResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;
    if (!chatId || chatId === "undefined" || chatId === "null") {
      return res.status(400).json({ error: "Chat ID is required" });
    }

    const chat = await Chat.findOne({ user: userId, _id: chatId }).populate("messages");
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const prompt = generateResumePrompt();

    chat.messages.push({
      role: "user",
      content: prompt,
    });

    const result = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: prompt,
      messages: chat.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const resume = result.content[0].text;

    const newResume = new Resume({
      chat: chat._id,
      html: resume,
    });
    await newResume.save();
    chat.resumes.push(newResume);
    await chat.save();

    res.setHeader('Access-Control-Expose-Headers', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,x-client-session')
    res.setHeader('Resume-ID', newResume._id);
    res.send(resume);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const convertToDocx = async (req, res) => {
  const { resumeId } = req.params;
  const resume = await Resume.findById(resumeId);
  if (!resumeId || resumeId === "undefined" || resumeId === "null") {
    return res.status(400).json({ error: "Resume ID is required" });
  }

  if (resume.docx) {
    const docxBuffer = resume.docx;
    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename=resume.docx`,
      'Content-Length': docxBuffer.length,
    });
    res.end(docxBuffer);
    return;
  }

  const inlinedHtml = processHTML(resume.html);

  try {
    var docx = htmlDocx.asBlob(inlinedHtml, {
      orientation: 'portrait',
      margins: { top: 566, right: 566, bottom: 566, left: 566 },
    });

    docx.arrayBuffer().then((arrayBuffer) => {
      const docxBuffer = Buffer.from(arrayBuffer);
      resume.docx = docxBuffer;
      resume.save().then(() => {
        res.writeHead(200, {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename=resume.docx`,
          'Content-Length': docxBuffer.length,
        });
        res.end(docxBuffer);
      }).catch(error => console.error("Error saving DOCX to the database:", error));
    }).catch(error => console.error("Error converting DOCX Blob to Buffer:", error));

  }
  catch (error) {
    console.error("Error generating DOCX:", error);
    res.status(500).json({ error: "Error generating DOCX" });
  }
}

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ user: userId })
      .select("-messages")
      .populate({ path: 'resumes', select: 'createdAt' });

    res.json(chats);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    if (!resumeId || resumeId === "undefined" || resumeId === "null") {
      return res.status(400).json({ error: "Resume ID is required" });
    }
    const resume = await Resume.findOne({ _id: resumeId });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.send(resume.html);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}