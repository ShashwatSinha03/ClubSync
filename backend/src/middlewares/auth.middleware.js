// backend/src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * verifyAccessToken
 * - Expects access token in cookie named "access_token"
 * - Verifies JWT and attaches req.user = { userId, email, role }
 */
export const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // normalized user object
    req.user = {
      userId: decoded.userId ?? decoded.userId ?? decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
