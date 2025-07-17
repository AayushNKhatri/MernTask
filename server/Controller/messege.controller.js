import { Message } from "../Models/messege.models.js";
import { Parser } from "json2csv";

export async function exportChat(req, res) {
  const { roomId, format = "json" } = req.query;
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Restrict users to export only their room
  if (user.role === "user" && !roomId.includes(user.id)) {
    return res.status(403).json({ message: "You can only export your own chat." });
  }

  const messages = await Message.find({ roomId }).sort({ createdAt: 1 }).populate("from to", "username");

  const mapped = messages.map((msg) => ({
    from: msg.from.username,
    to: msg.to.username,
    content: msg.content,
    delivered: msg.delivered,
    read: msg.read,
    time: msg.createdAt,
  }));

  if (format === "csv") {
    const parser = new Parser();
    const csv = parser.parse(mapped);
    res.header("Content-Type", "text/csv");
    res.attachment(`${roomId}-chat.csv`);
    return res.send(csv);
  } else {
    return res.json(mapped);
  }
}

export async function exportAllChats(req, res) {
  const { format = "json" } = req.query;
  const user = req.session.user;

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can export all chats." });
  }

  const messages = await Message.find().sort({ createdAt: 1 }).populate("from to", "username roomId");

  const mapped = messages.map((msg) => ({
    roomId: msg.roomId,
    from: msg.from.username,
    to: msg.to.username,
    content: msg.content,
    delivered: msg.delivered,
    read: msg.read,
    time: msg.createdAt,
  }));

  if (format === "csv") {
    const parser = new Parser();
    const csv = parser.parse(mapped);
    res.header("Content-Type", "text/csv");
    res.attachment(`all-chat.csv`);
    return res.send(csv);
  } else {
    return res.json(mapped);
  }
}

export async function getChatHistory(req, res) {
  const { roomId } = req.params;
  const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
  res.json({ messages });
}