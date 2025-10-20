import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, enum: ["admin", "student"], default: "student" },
    gender: { type: String, enum: ["male", "female"], required: false },
   students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
