// backend/routes/chatRoutes.js
import express from "express";
import Chat from "../models/ChatModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Save chat message
router.post("/save", verifyToken, async (req, res) => {
  const { sender, message } = req.body;
  const userId = req.user.id;

  try {
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    chat.messages.push({ sender, message });
    await chat.save();

    res.status(200).json({ success: true, chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save chat." });
  }
});

// Get chat history
router.get("/history", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const chat = await Chat.findOne({ userId });

    res.status(200).json(chat ? chat.messages : []);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load chat." });
  }
});

export default router;
