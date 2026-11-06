export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(", ") });
  }
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid resource ID" });
  if (err.code === 11000) return res.status(409).json({ message: "An account with this email already exists" });
  console.error(err);
  res.status(status).json({ message: err.message || "Server error" });
}
