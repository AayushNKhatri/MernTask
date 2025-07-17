import Chat from "../components/ChatWindow";
import { useLocation } from "react-router-dom";

export default function AgentDashboard() {
  const location = useLocation();
  // Replace with actual session/agent info
  const agent = { username: "actual_agent_username" }; // Get from session or login response
  const roomId = "room_actualUserId_actualAgentId"; // Get from backend/session
  const otherUsername = "user_username"; // Get from backend/session

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Agent Dashboard</h2>
        <Chat roomId={roomId} user={agent} otherUsername={otherUsername} />
      </div>
    </div>
  );
}