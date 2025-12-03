// backend/src/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import prisma from "../lib/prisma.js";

const ACCESS_TOKEN_EXPIRES_IN = "15m"; // adjust as you like
const REFRESH_TOKEN_EXPIRES_IN = "30d";
const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", // keep lax for normal flows; change to 'none' + secure for cross-site cookie in production
  path: "/",
};

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}
function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

/* ---------------------------
   Signup
   - creates user with hashed password
   - default role: member, approved: false (admin must approve)
---------------------------- */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: "name, email and password required" });

    // check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "member",
        approved: false,
      },
      select: { id: true, email: true, name: true, role: true, approved: true, createdAt: true },
    });

    return res.status(201).json({ message: "Signup success — pending admin approval", user });
  } catch (err) {
    next(err);
  }
};

/* ---------------------------
   Login
   - validates credentials
   - issues access and refresh cookies
---------------------------- */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // ensure approved (depending on your flow)
    if (!user.approved) return res.status(403).json({ message: "Account pending admin approval" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // sign tokens
    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email, role: user.role });

    // store refresh token in DB (optional but recommended)
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    // set cookies
    res.cookie(ACCESS_COOKIE_NAME, accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 }); // 15m
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, { ...COOKIE_OPTIONS, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30d

    // return user summary
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      approved: user.approved,
    };

    return res.json({ message: "Login success", user: safeUser });
  } catch (err) {
    next(err);
  }
};

/* ---------------------------
   Logout
   - clears cookies and removes refresh token from DB
---------------------------- */
export const logout = async (req, res, next) => {
  try {
    // clear refresh token in DB if user known (optional)
    try {
      // if verifyAccessToken middleware attached req.user, use it
      const token = req.cookies?.[REFRESH_COOKIE_NAME];
      if (token) {
        // try decode to get userId (do not throw if fails)
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        if (decoded?.userId) {
          await prisma.user.update({ where: { id: decoded.userId }, data: { refreshToken: null } });
        }
      }
    } catch (e) {
      // ignore
    }

    // clear cookies
    res.clearCookie(ACCESS_COOKIE_NAME, { path: "/" });
    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/" });

    return res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

/* ---------------------------
   Me — returns current user info
   - must be called after verifyAccessToken middleware
   - fetches fresh user record from DB for latest role/approved status
---------------------------- */
export const me = async (req, res, next) => {
  try {
    // verifyAccessToken should attach req.user
    const sessionUser = req.user;
    if (!sessionUser) return res.status(401).json({ message: "Not authenticated" });

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.userId ?? sessionUser.id ?? sessionUser.userId },
      select: { id: true, name: true, email: true, role: true, approved: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ user });
  } catch (err) {
    next(err);
  }
};
