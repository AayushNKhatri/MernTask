import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
    require:true,
  },
  role: {
    type: String,
    enum: ["user", "agent", "admin"],
    default: "user",
  },
  online: {
    type: Boolean,
    default: false,
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to another user (agent)
    default: null,
  },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
