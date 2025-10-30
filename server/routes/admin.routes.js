const router = require("express").Router();
const Admin = require("../models/Admin.model");

// GET /api/admin/profile
// A protected route that returns the currently logged-in admin's profile.
router.get("/profile", async (req, res, next) => {
  try {
    // The user's info is attached to the request at req.payload
    // from the isAuthenticated middleware.
    const adminId = req.payload._id;
    
    // Find the admin in the database.
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Don't send the hashed password back!
    const userProfile = {
      _id: admin._id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
});

module.exports = router;