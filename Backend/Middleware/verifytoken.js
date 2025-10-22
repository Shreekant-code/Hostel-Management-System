
import jwt from "jsonwebtoken";

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies; 
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
