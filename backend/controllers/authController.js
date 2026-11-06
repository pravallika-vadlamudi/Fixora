import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const safeUser = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, address: u.address });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 8) return res.status(400).json({ message: "Password must contain at least 8 characters" });
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Email is already registered" });
  // Public registration always creates a customer. Roles are assigned by an administrator.
  const user = await User.create({ name, email, password, phone, role: "customer" });
  res.status(201).json({ token: makeToken(user._id), user: safeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || "").toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password || ""))) return res.status(401).json({ message: "Invalid email or password" });
  if (!user.isActive) return res.status(403).json({ message: "Account is disabled" });
  res.json({ token: makeToken(user._id), user: safeUser(user) });
});

export const me = asyncHandler(async (req, res) => res.json({ user: safeUser(req.user) }));
