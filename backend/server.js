import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import Service from "./models/Service.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(s => s.trim()) : true,
  credentials: false
}));
app.use(express.json({ limit: "1mb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.get("/api/health", (req, res) => res.json({ status: "ok", app: "Fixora API", timestamp: new Date().toISOString() }));
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

const seedServices = async () => {
  const count = await Service.countDocuments();
  if (count) return;
  await Service.insertMany([
    { name: "Electrical Repair", category: "Electrical", description: "Safe diagnosis and repair of switches, sockets, fans, lighting and common household electrical issues.", price: 499, duration: "60–90 min", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900" },
    { name: "Plumbing Service", category: "Plumbing", description: "Leak repair, tap installation, drainage checks and other everyday plumbing work.", price: 399, duration: "60 min", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900" },
    { name: "Home Deep Cleaning", category: "Cleaning", description: "Detailed cleaning for kitchens, bathrooms, floors and living spaces.", price: 1299, duration: "2–3 hours", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900" },
    { name: "AC Service", category: "Appliance Repair", description: "Routine air-conditioner inspection, filter cleaning and performance servicing.", price: 799, duration: "60–90 min", image: "https://images.unsplash.com/photo-1631545806609-5f4f7a3f8b87?w=900" },
    { name: "Carpentry Work", category: "Carpentry", description: "Furniture assembly, hinge repair, shelves and small woodwork fixes.", price: 599, duration: "60 min", image: "https://images.unsplash.com/photo- woodworking?w=900" },
    { name: "Interior Painting", category: "Painting", description: "Professional wall touch-ups and room painting consultation.", price: 999, duration: "Quote required", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=900" }
  ]);
  console.log("Sample service catalogue created");
};

const port = process.env.PORT || 5000;
connectDB().then(seedServices).then(() => app.listen(port, () => console.log(`Fixora API running on ${port}`)))
  .catch(err => { console.error("Startup failed:", err.message); process.exit(1); });
