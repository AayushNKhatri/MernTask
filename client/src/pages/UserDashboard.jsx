import Chat from "../components/ChatWindow";
import { useLocation } from "react-router-dom";

export default function UserDashboard() {
  const location = useLocation();
  // Replace with actual session/user info
  const user = { username: "actual_username" }; // Get from session or login response
  const roomId = "room_actualUserId_actualAgentId"; // Get from login response
  const otherUsername = "agent_username"; // Get from backend/session

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">User Dashboard</h2>
        <Chat roomId={roomId} user={user} otherUsername={otherUsername} />
      </div>
    </div>
  );
}