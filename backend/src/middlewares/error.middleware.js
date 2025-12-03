export const errorHandler = (err, req, res, next) => {
  console.error("🔥 FULL ERROR:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
    stack: err.stack,
  });
};
