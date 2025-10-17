import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String, default: "India" }
    },
    parentDetails: {
        fatherName: { type: String },
        fatherPhone: { type: String },
        motherName: { type: String },
        motherPhone: { type: String }
    },
    admissionYear: { type: Number, required: true },
    year: { type: String, enum: ['1st', '2nd', '3rd', '4th'], required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


const Student = mongoose.model("Student", studentSchema);

export default Student;
