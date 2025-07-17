import { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import api from "../services/api";

export default function Chat({ roomId, user, otherUsername }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  let typingTimeout = useRef(null);

  useEffect(() => {
    // Join room on mount
    if (roomId && user?.username) {
      socket.emit("join_room", { roomId, userId: user.username });
    }

    // Fetch chat history from backend
    async function fetchHistory() {
      try {
        const res = await api.get(`/api/message/history/${roomId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        // Handle error or show empty chat
      }
    }
    fetchHistory();

    // Listen for incoming messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for typing indicator
    socket.on("user_typing", (data) => {
      if (data.userId !== user.username) setOtherTyping(true);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setOtherTyping(false), 1500);
    });

    // Listen for unread message count
    socket.on("unread_count", ({ roomId: incomingRoomId, count }) => {
      if (incomingRoomId === roomId) setUnreadCount(count);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("unread_count");
      clearTimeout(typingTimeout.current);
    };
  }, [roomId, user?.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send_message", {
      roomId,
      from: user.username,
      to: otherUsername,
      content: input,
    });
    setInput("");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { roomId, userId: user.username });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 text-right text-sm text-gray-500">
        {unreadCount > 0 && `Unread messages: ${unreadCount}`}
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.from === user.username ? "text-right" : "text-left"}`}>
            <span className="inline-block px-3 py-2 rounded bg-indigo-100 text-gray-800">{msg.content}</span>
          </div>
        ))}
        {otherTyping && (
          <div className="mb-2 text-left text-sm text-gray-500">User is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex p-2 border-t">
        <input
          className="flex-1 px-3 py-2 border rounded-lg"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}