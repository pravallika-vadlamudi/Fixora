import Service from "../models/Service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listServices = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
  if (req.query.q) filter.$or = [
    { name: { $regex: req.query.q, $options: "i" } },
    { description: { $regex: req.query.q, $options: "i" } },
    { category: { $regex: req.query.q, $options: "i" } }
  ];
  res.json({ services: await Service.find(filter).sort({ category: 1, name: 1 }) });
});
export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, isActive: true });
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json({ service });
});
export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ service });
});
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json({ service });
});
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json({ message: "Service archived successfully" });
});
