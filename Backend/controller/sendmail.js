import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendStudentWelcomeEmail = async (
  studentEmail,
  studentName,
  password,
  roomNumber
) => {
  try {
    console.log(`📨 Preparing to send welcome email to: ${studentEmail}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      logger: true, 
      debug: true, 
    });

    const info = await transporter.sendMail({
      from: `"Hostel Management System 🏠" <${process.env.GMAIL_USER}>`,
      to: studentEmail,
      subject: `🎉 Welcome to Your Hostel, ${studentName}!`,
      text: `Hello ${studentName},

Your account has been created successfully.

Email: ${studentEmail}
Password: ${password}
Room Number: ${roomNumber}

Login to the Hostel Portal to access your dashboard.

Regards,
Hostel Management Team`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #0078d4; color: white; text-align: center; padding: 20px;">
              <h1 style="margin: 0;">🏠 Welcome to HostelEase</h1>
              <p>Your trusted Hostel Management System</p>
            </div>
            <div style="padding: 20px;">
              <h2>Hello ${studentName}, 👋</h2>
              <p>We’re thrilled to have you join our hostel community!</p>
              <p>Your account has been successfully created by the Admin. Here are your login credentials:</p>
              <div style="background: #f1f9ff; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 5px solid #0078d4;">
                <p><strong>Email:</strong> ${studentEmail}</p>
                <p><strong>Password:</strong> ${password}</p>
              </div>

              <p>🎯 <strong>Your Assigned Room:</strong></p>
              <div style="background: #fff3e0; padding: 20px; border-radius: 12px; text-align: center; font-size: 24px; font-weight: bold; color: #e65100; margin: 15px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                ${roomNumber}
              </div>

              <p>👉 You can now login to your <a href="https://hostelportal.example.com" style="color: #0078d4; text-decoration: none;">Student Dashboard</a> to view your roommates, announcements, and more.</p>

              <div style="margin: 30px 0; text-align: center;">
                <img src="https://res.cloudinary.com/dtlessn0g/image/upload/v1760998473/hostel_image_l8lacc.png" alt="Hostel Room" style="width: 100%; border-radius: 10px;"/>
              </div>

              <p style="margin-top: 20px;">If you face any issues logging in, contact the hostel admin immediately.</p>
              <p>Regards,<br/><strong>Shreekant Yadav</strong></p>
              <a href="https://shreekant-yadav-07.vercel.app/" style="color: #0078d4; text-decoration: none;">Shreekant Portfolio</a>
            </div>

            <div style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 13px; color: #666;">
              <p>© 2025 HostelEase. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("✅ Student welcome email sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("📨 SMTP Response:", info.response);

  } catch (error) {
    console.error("❌ Error sending student email:", error.message);
  }
};
