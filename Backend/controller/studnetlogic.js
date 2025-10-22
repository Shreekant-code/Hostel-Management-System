import User from "../Schema/userschema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../Schema/studentschema.js";
import Room from "../Schema/Roomschema.js";

export const StudentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Please provide email and password" });

    const student = await User.findOne({ email, role: "student" });
    if (!student) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: student._id, email: student.email, role: student.role },
      accessToken,
    });
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getMyDetails = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId)
      .populate("room", "roomNumber capacity gender students") // only populate room
      .select("-password -__v"); 

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student details fetched successfully",
      student,
    });
  } catch (err) {
    console.error("❌ Error fetching student details:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getRoommates = async (req, res) => {
  try {
    const studentId = req.user.id; 

    // Find the student and populate the room with students
    const student = await Student.findById(studentId).populate({
      path: "room",
      populate: {
        path: "students",
        select: "firstName lastName email phone gender year parentDetails"
      },
    });

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!student.room) return res.status(404).json({ message: "No room assigned to student" });

   
    const roommates = student.room.students
      .filter((s) => s._id.toString() !== student._id.toString())
      .map((s) => ({
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        phone: s.phone,
        gender: s.gender,
        year: s.year,
        fatherName: s.parentDetails?.fatherName || "",
        fatherPhone: s.parentDetails?.fatherPhone || "",
        motherName: s.parentDetails?.motherName || "",
        motherPhone: s.parentDetails?.motherPhone || "",
      }));

    res.status(200).json({
      roomNumber: student.room.roomNumber,
      roommates,
    });
  } catch (err) {
    console.error("Error fetching roommates:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
