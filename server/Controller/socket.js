import { Message } from "../Models/messege.models.js";
import { User } from "../Models/user.models.js";  // Adjust path if needed

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on("join_room", ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      io.to(roomId).emit("user_connected", { userId });
    });

    socket.on("send_message", async (data) => {
      const { roomId, from: fromUsername, to: toUsername, content } = data;
          console.log("📥 Incoming message:");
  console.log("From:", fromUsername, "| To:", toUsername);
      try {
        // Find sender user by username
        const fromUser = await User.findOne({ username: fromUsername });
        // Find receiver user by username
        const toUser = await User.findOne({ username: toUsername });
          console.log("fromUser found:", fromUser);
  console.log("toUser found:", toUser);

        if (!fromUser || !toUser) {
          return socket.emit("message_error", { error: "User(s) not found" });
        }

        console.log(`📨 Message from ${fromUser.username} to ${toUser.username} in room ${roomId}`);

        // Create and save message with ObjectId references
        const newMessage = await Message.create({
          roomId,
          from: fromUser._id,
          to: toUser._id,
          content,
          delivered: true,
        });

        // Emit to room with readable usernames
        io.to(roomId).emit("receive_message", {
          _id: newMessage._id,
          from: fromUser.username,
          content,
          delivered: true,
          timestamp: newMessage.createdAt,
        });
      } catch (error) {
        console.error("❌ Message save error:", error);
        socket.emit("message_error", { error: "Failed to save message" });
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
