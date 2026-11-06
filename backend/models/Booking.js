import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  scheduledDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String, default: "" },
  priceAtBooking: { type: Number, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected", "in-progress", "completed", "cancelled"], default: "pending" },
  cancellationReason: { type: String, default: "" }
}, { timestamps: true });

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ provider: 1, status: 1 });
export default mongoose.model("Booking", bookingSchema);
