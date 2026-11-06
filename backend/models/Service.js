import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  duration: { type: String, default: "1 hour" },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
