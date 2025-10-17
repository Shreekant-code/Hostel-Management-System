import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk user ID
  role: { type: String, enum: ["admin", "student"], default: "student" },
  gender: { type: String, enum: ["male", "female"], required: false },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
