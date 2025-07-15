import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
