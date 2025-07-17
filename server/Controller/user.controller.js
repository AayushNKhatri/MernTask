import { User } from "../Models/user.models.js";
import bcrypt from "bcrypt"
export async function login(req, res) {
  const { username, role, password } = req.body;

  if (!username || !role || !password) {
    return res.status(400).json({ message: "Username, role and password are required" });
  }

  let user = await User.findOne({ username });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!user) {
    if (role === "admin") {
      return res.status(400).json({ message: "Cannot login as Admin" });
    }

    // Create user and assign online status
    user = await User.create({ username, role, password: hashedPassword, online: true });

    // If role is user, assign an available agent
    if (role === "user") {
      const agent = await User.findOne({ role: "agent", online: true });
      if (!agent) {
        return res.status(503).json({ message: "No online agents available" });
      }

      user.assignedAgent = agent._id;
      await user.save();
    }
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Wrong password" });
  }

  req.session.user = {
    id: user._id,
    username: user.username,
    role: user.role,
  };

  
  let roomId = null;
  if (user.role === "user" && user.assignedAgent) {
    roomId = `room_${user._id}_${user.assignedAgent}`;
  } else if (user.role === "agent") {
    
    roomId = null;
  }

  res.status(200).json({
    message: "Login successful",
    user: req.session.user,
    assignedAgent: user.assignedAgent,
    roomId,
  });
}

export async function logout(req, res) {
    if (!req.session.user) {
        return res.status(400).json({ message: "No active session found" });
    }

    console.log(req.session.user);

    const userId = req.session.user.id;

    // Update user's online status before destroying session
    await User.findByIdAndUpdate(userId, { online: false });

    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).json({ message: "Failed to logout" });
        }

        res.json({ message: "Logged out successfully" });
    });
}