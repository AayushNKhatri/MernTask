import express from "express";
import { exportChat, exportAllChats, getChatHistory } from "../Controller/messege.controller.js";

const router = express.Router();

router.get("/export", exportChat);
router.get("/export/all", exportAllChats);
router.get("/history/:roomId", getChatHistory);

export default router;
