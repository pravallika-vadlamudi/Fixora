import User from "../models/User.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const stats = asyncHandler(async (req, res) => {
  const [users, providers, services, bookings, pending, completed] = await Promise.all([
    User.countDocuments({ role: "customer" }), User.countDocuments({ role: "provider" }),
    Service.countDocuments({ isActive: true }), Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }), Booking.countDocuments({ status: "completed" })
  ]);
  res.json({ stats: { users, providers, services, bookings, pending, completed } });
});
export const users = asyncHandler(async (req, res) => {
  const list = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users: list });
});
