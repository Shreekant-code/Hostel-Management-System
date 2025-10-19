import db_connect from "./Database/db_connect.js";
import User from "./Schema/userschema.js";
import bcrypt from "bcryptjs";

const seedAdmins = async () => {
  await db_connect(); 

 
  await User.deleteMany({});

 
  const admins = [
    { email: "admin1@example.com", password: "Admin@123" },
    { email: "admin2@example.com", password: "Admin@123" },
    { email: "admin3@example.com", password: "Admin@123" },
  ];

  for (let admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    await User.create({
      email: admin.email,
      password: hashedPassword,
      role: "admin",
    });
  }

  console.log("✅ Admins seeded successfully");
  process.exit();
};

seedAdmins();
