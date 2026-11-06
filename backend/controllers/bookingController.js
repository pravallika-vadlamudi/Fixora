import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const populate = (query) => query.populate("service", "name category price image").populate("customer", "name email phone").populate("provider", "name email phone");

export const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, scheduledDate, timeSlot, address, notes } = req.body;
  const service = await Service.findOne({ _id: serviceId, isActive: true });
  if (!service) return res.status(404).json({ message: "Selected service is unavailable" });
  const date = new Date(scheduledDate);
  if (Number.isNaN(date.getTime()) || date < new Date(new Date().setHours(0,0,0,0))) {
    return res.status(400).json({ message: "Choose a valid future date" });
  }
  if (!timeSlot || !address?.trim()) return res.status(400).json({ message: "Time slot and address are required" });
  const booking = await Booking.create({
    customer: req.user._id, service: service._id, scheduledDate: date,
    timeSlot, address: address.trim(), notes: notes || "", priceAtBooking: service.price
  });
  res.status(201).json({ booking: await populate(Booking.findById(booking._id)) });
});

export const myBookings = asyncHandler(async (req, res) => {
  const filter = req.user.role === "provider" ? { provider: req.user._id } : { customer: req.user._id };
  res.json({ bookings: await populate(Booking.find(filter).sort({ createdAt: -1 })) });
});

export const allBookings = asyncHandler(async (req, res) => {
  res.json({ bookings: await populate(Booking.find().sort({ createdAt: -1 })) });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["accepted", "rejected", "in-progress", "completed"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (req.user.role === "provider" && String(booking.provider) !== String(req.user._id)) {
    return res.status(403).json({ message: "This booking is not assigned to you" });
  }
  const transitions = {
    pending: ["accepted", "rejected"],
    accepted: ["in-progress"],
    "in-progress": ["completed"],
    rejected: [], completed: [], cancelled: []
  };
  if (!transitions[booking.status]?.includes(status) && req.user.role !== "admin") {
    return res.status(400).json({ message: `Cannot change ${booking.status} to ${status}` });
  }
  booking.status = status;
  await booking.save();
  res.json({ booking: await populate(Booking.findById(booking._id)) });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status !== "pending") return res.status(400).json({ message: "Only pending bookings can be cancelled" });
  booking.status = "cancelled";
  booking.cancellationReason = req.body.reason || "";
  await booking.save();
  res.json({ booking });
});

export const assignProvider = asyncHandler(async (req, res) => {
  const provider = await User.findOne({ _id: req.body.providerId, role: "provider", isActive: true });
  if (!provider) return res.status(404).json({ message: "Active provider not found" });
  const booking = await Booking.findByIdAndUpdate(req.params.id, { provider: provider._id }, { new: true });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json({ booking: await populate(Booking.findById(booking._id)) });
});
