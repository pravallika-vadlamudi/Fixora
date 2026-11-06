import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const booking = await Booking.findOne({ _id: bookingId, customer: req.user._id, status: "completed" });
  if (!booking) return res.status(400).json({ message: "Only your completed bookings can be reviewed" });
  const review = await Review.create({ customer: req.user._id, service: booking.service, booking: booking._id, rating, comment });
  res.status(201).json({ review });
});
export const serviceReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ service: req.params.serviceId }).populate("customer", "name").sort({ createdAt: -1 });
  res.json({ reviews });
});
