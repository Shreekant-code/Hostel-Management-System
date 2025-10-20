import jwt from "jsonwebtoken";
import User from "../Schema/userschema.js";
import Room from "../Schema/Roomschema.js";
import bcrypt from "bcryptjs";

export const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: admin._id, role: admin.role },
     process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1hr" }
    );

    const refreshToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { email: admin.email, role: admin.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




const generatePassword = (length = 5) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const createStudent = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, gender, dateOfBirth,
      address, parentDetails, admissionYear, year
    } = req.body;

  
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    
    const randomPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

   
    const availableRooms = await Room.find({
      gender,
      $expr: { $lt: [{ $size: "$students" }, "$capacity"] }
    });

    if (!availableRooms.length) {
      return res.status(400).json({ message: "No available room for this gender" });
    }

    // Pick a random room from available rooms
    const randomIndex = Math.floor(Math.random() * availableRooms.length);
    const room = availableRooms[randomIndex];


    const student = await User.create({
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
      room: room._id,
      password: hashedPassword,
      role: "student"
    });


    room.students.push(student._id);
    await room.save();

   
    res.status(201).json({
      message: "Student created successfully",
      student: {
        email: student.email,
        password: randomPassword, 
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const RefreshToken = async (req, res) => {
  try {
    const { token } = req.body; 

    if (!token) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    jwt.verify(token,process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).populate("room", "roomNumber capacity students");
    res.status(200).json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id).populate("room", "roomNumber capacity students");
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }
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
      year
    } = req.body;

    const student = await User.findById(id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if email is being updated and already exists
    if (email && email !== student.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists" });
      student.email = email;
    }

    // Update basic fields
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
      const availableRooms = await Room.find({
        gender,
        $expr: { $lt: [{ $size: "$students" }, "$capacity"] }
      });

      if (!availableRooms.length) {
        return res.status(400).json({ message: "No available room for this gender" });
      }

      
      if (student.room) {
        const oldRoom = await Room.findById(student.room);
        oldRoom.students = oldRoom.students.filter(s => s.toString() !== student._id.toString());
        await oldRoom.save();
      }

      
      const randomIndex = Math.floor(Math.random() * availableRooms.length);
      const newRoom = availableRooms[randomIndex];
      student.room = newRoom._id;
      newRoom.students.push(student._id);
      await newRoom.save();
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
    const student = await User.findById(id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

  
    if (student.room) {
      const room = await Room.findById(student.room);
      room.students = room.students.filter(s => s.toString() !== student._id.toString());
      await room.save();
    }

    await student.remove();
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("students", "firstName lastName email gender");

    // Separate wings
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
        }))
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
        }))
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
      students: room.students.map(student => ({
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        parentDetails: student.parentDetails,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};