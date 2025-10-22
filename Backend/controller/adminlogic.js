import bcrypt from "bcryptjs";
import streamifier from "streamifier";
import Student from "../Schema/studentschema.js";
import Room from "../Schema/Roomschema.js";
import User from "../Schema/userschema.js";
import { sendStudentWelcomeEmail } from "./sendmail.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: generate random password
const generatePassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Helper: upload image to Cloudinary
const uploadImage = async (fileBuffer) => {
  if (!fileBuffer) return null;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "students" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Helper: assign a room based on gender
const assignRoom = async (student, gender) => {
  const roomGender = gender.toLowerCase();
  const availableRooms = await Room.find({
    gender: roomGender,
    $expr: { $lt: [{ $size: "$students" }, "$capacity"] },
  });

  if (!availableRooms.length) return null;

  const randomIndex = Math.floor(Math.random() * availableRooms.length);
  const room = availableRooms[randomIndex];

  student.room = room._id;
  room.students.push(student._id);
  await room.save();

  return room;
};

export const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Please provide email and password" });

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: admin._id, role: admin.role },
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
      user: { id: admin._id, email: admin.email, role: admin.role },
      accessToken,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const createStudent = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      address,
      fatherName,
    fatherPhone,
    motherName,motherPhone,
      admissionYear,
      year,
    } = req.body;

    if (!firstName || !lastName || !email || !gender || !admissionYear || !year)
      return res.status(400).json({ message: "Missing required fields" });

    gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
    const yearMap = { "1": "1st", "2": "2nd", "3": "3rd", "4": "4th" };
    year = yearMap[year] || year;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const randomPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const imageUrl = req.file ? await uploadImage(req.file.buffer) : null;

  const student = new Student({
  firstName,
  lastName,
  email,
  phone,
  gender, 
  dateOfBirth,
  address: typeof address === "string" ? JSON.parse(address) : address || {},
  parentDetails: {
    fatherName,
    fatherPhone,
    motherName,
    motherPhone,
  },
  admissionYear,
  year,
  image: imageUrl,
});



    const room = await assignRoom(student, gender);
    if (!room) return res.status(400).json({ message: "No available room for this gender" });

    student.room = room._id;
    await student.save();

    const user = new User({
      _id: student._id,
      email,
      password: hashedPassword,
      role: "student",
      gender,
      room: room._id,
    });
    await user.save();

    sendStudentWelcomeEmail(email, firstName, randomPassword, room.roomNumber)
      .then(() => console.log("✅ Welcome email sent"))
      .catch((err) => console.error("❌ Email sending failed:", err));

    res.status(201).json({
      message: "Student created successfully",
      student: {
        id: student._id,
        email: student.email,
        password: randomPassword,
        room: { id: room._id, number: room.roomNumber },
        image: student.image,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("room", "roomNumber capacity students");
    res.status(200).json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).populate("room", "roomNumber capacity students");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      address,
      parentDetails,
      admissionYear,
      year,
    } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check email in User collection
    if (email && email !== student.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already exists" });
      student.email = email;
      const user = await User.findById(student._id);
      if (user) user.email = email;
      await user.save();
    }

    student.firstName = firstName || student.firstName;
    student.lastName = lastName || student.lastName;
    student.phone = phone || student.phone;
    student.gender = gender || student.gender;
    student.dateOfBirth = dateOfBirth || student.dateOfBirth;
    student.address = address || student.address;
    student.parentDetails = parentDetails || student.parentDetails;
    student.admissionYear = admissionYear || student.admissionYear;
    student.year = year || student.year;

    if (gender && gender !== student.gender) {
      if (student.room) {
        const oldRoom = await Room.findById(student.room);
        oldRoom.students = oldRoom.students.filter((s) => s.toString() !== student._id.toString());
        await oldRoom.save();
      }
      const newRoom = await assignRoom(student, gender);
      if (!newRoom) return res.status(400).json({ message: "No available room for this gender" });
    }

    await student.save();
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    // Remove student from room
    if (student.room) {
      const room = await Room.findById(student.room);
      if (room) {
        room.students = room.students.filter(s => s.toString() !== student._id.toString());
        await room.save();
      }
    }

     // Also delete the corresponding User
    await User.deleteOne({ _id: student._id });
    await Student.deleteOne({ _id: student._id });

   

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("students", "firstName lastName email gender");

    const girlsWing = rooms
      .filter(r => r.gender === "female")
      .map(r => ({
        id: r._id,
        roomNumber: r.roomNumber,
        capacity: r.capacity,
        students: r.students.map(s => ({
          id: s._id,
          name: `${s.firstName} ${s.lastName}`,
          email: s.email,
        })),
      }));

    const boysWing = rooms
      .filter(r => r.gender === "male")
      .map(r => ({
        id: r._id,
        roomNumber: r.roomNumber,
        capacity: r.capacity,
        students: r.students.map(s => ({
          id: s._id,
          name: `${s.firstName} ${s.lastName}`,
          email: s.email,
        })),
      }));

    res.status(200).json({ girlsWing, boysWing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate(
      "students",
      "firstName lastName email phone gender dateOfBirth parentDetails"
    );

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json({
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      students: room.students.map((s) => ({
        id: s._id,
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        phone: s.phone,
        gender: s.gender,
        dateOfBirth: s.dateOfBirth,
        parentDetails: s.parentDetails,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
