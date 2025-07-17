import { Message } from "../Models/messege.models.js";
import { User } from "../Models/user.models.js";
import redis from "../lib/redis.js"; // <-- import Redis

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on("join_room", async ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);

      // Emit unread count for that user
      const user = await User.findOne({ username: userId });
      if (user) {
        const unread = await Message.countDocuments({
          to: user._id,
          read: false,
        });
        socket.emit("unread_count", { roomId, count: unreadCount });
      }

      // Load chat history
      const cachedMessages = await redis.get(`chat:${roomId}`);
      if (cachedMessages) {
        console.log("🧠 Loaded chat from Redis cache");
        socket.emit("chat_history", JSON.parse(cachedMessages));
      } else {
        const dbMessages = await Message.find({ roomId })
          .sort({ createdAt: 1 })
          .lean();
        socket.emit("chat_history", dbMessages);

        await redis.set(`chat:${roomId}`, JSON.stringify(dbMessages), {
          EX: 3600,
        });
      }

      io.to(roomId).emit("user_connected", { userId });
    });

    socket.on("send_message", async (msg) => {
      // Save message to DB
      const fromUser = await User.findOne({ username: msg.from });
      const toUser = await User.findOne({ username: msg.to });
      const newMsg = await Message.create({
        roomId: msg.roomId,
        from: fromUser._id,
        to: toUser._id,
        content: msg.content,
        delivered: true,
        read: false,
      });

      // Emit message to room
      io.to(msg.roomId).emit("receive_message", {
        ...msg,
        delivered: true,
        read: false,
        createdAt: newMsg.createdAt,
      });

      // Count unread for recipient
      const unreadCount = await Message.countDocuments({
        roomId: msg.roomId,
        to: toUser._id,
        read: false,
      });

      // Emit unread count to recipient only
      const recipientSocketId = getSocketIdForUser(msg.to); // You need to track socket IDs per user
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("unread_count", {
          roomId: msg.roomId,
          count: unreadCount,
        });
      }
    });

    socket.on("mark_as_read", async ({ roomId, readerUsername }) => {
      try {
        const reader = await User.findOne({ username: readerUsername });
        if (!reader) return;

        await Message.updateMany(
          { roomId, to: reader._id, read: false },
          { $set: { read: true } }
        );

        io.to(roomId).emit("messages_read", { by: readerUsername });
      } catch (err) {
        console.error("❌ Error marking messages as read:", err);
      }
    });

    socket.on("typing", ({ roomId, userId }) => {
      socket.to(roomId).emit("user_typing", { userId });
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
