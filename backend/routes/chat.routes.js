import express from "express";
import { startChat, getMessages, generateResume, convertToDocx, getChats, getResume } from "../controllers/chat.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getChats);
router.post("/send/:chatId?", protectRoute, startChat);
router.get("/generate/:chatId", protectRoute, generateResume);
router.get("/resume/:resumeId", protectRoute, getResume);
router.get("/doc/:resumeId", protectRoute, convertToDocx);
router.get("/:chatId", protectRoute, getMessages);

export default router;
