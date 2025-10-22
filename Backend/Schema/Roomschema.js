import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true }, 
  gender: { type: String, enum: ["male", "female"], required: true }, 
  capacity: { 
    type: Number, 
    required: true,
    default: () => Math.random() < 0.5 ? 2 : 3 
  },
  students: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Student" } 
  ]
}, { timestamps: true });

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Room;
