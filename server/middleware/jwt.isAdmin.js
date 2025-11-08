const isAdmin = (req, res, next) => {
  if (req.payload && req.payload.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin only" });
};

module.exports = { isAdmin };
