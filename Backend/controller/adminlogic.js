import jwt from "jsonwebtoken";
import User from "../Schema/userschema.js";
import Room from "../Schema/Roomschema.js";

import nodemailer from "nodemailer";



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
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.TZJWT_REFRESH_SECRET,
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



// Generate a random password
const generatePassword = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Send email
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or any other SMTP service
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // app password or email password
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
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

   
    const room = await Room.findOne({
      gender,
      $expr: { $lt: [{ $size: "$students" }, "$capacity"] }
    });

    if (!room) return res.status(400).json({ message: "No available room for this gender" });

    // 4️⃣ Create student
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


    const emailText = `Hi ${firstName},

Your account has been created successfully!

Email: ${email}
Password: ${randomPassword}

You can login at: http://localhost:5173/sign-in

Regards,
Hostel Admin`;

    await sendEmail(email, "Hostel Management - Login Credentials", emailText);

    res.status(201).json({ message: "Student created and email sent", student });
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
