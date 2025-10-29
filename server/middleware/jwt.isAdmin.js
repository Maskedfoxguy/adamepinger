const isAdmin = (req, res, next) => {
  // The JWT payload is attached as req.payload by express-jwt
  if (req.payload && req.payload.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin only" });
};

module.exports = { isAdmin };



















