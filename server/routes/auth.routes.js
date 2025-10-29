const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.model");

const { isAuthenticated, resolveTokenSecret } = require("../middleware/jwt.middleware");

// Resolve once so the login route shares the same secret logic as the JWT middleware.
const tokenSecret = resolveTokenSecret();

const router = express.Router(); 
// POST --> auth/login

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  try {
    // Look up the admin record before comparing passwords.
    const foundAdmin = await Admin.findOne({ email });

    if (!foundAdmin) {
      res.status(401).json({ message: "Admin not found." });
      return;
    }

    // bcryptjs exposes a promise API that keeps the event loop free.
    const passwordCorrect = await bcrypt.compare(password, foundAdmin.password);

    if (!passwordCorrect) {
      res.status(401).json({ message: "Unable to authenticate the user" });
      return;
    }

    const { _id, firstName, lastName, role } = foundAdmin;
    // Preserve the email from the request payload to avoid accidental schema reads.
    const payload = { _id, email, firstName, lastName, role };

    // Attach the payload so downstream middleware can trust the authentication context.
    req.admin = payload;

    const authToken = jwt.sign(payload, tokenSecret, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken });
  } catch (error) {
    // Forward unexpected errors to the global error handler.
    next(error);
  }
});


router.get("/verify", isAuthenticated, (req, res) => {
  console.log(`req.payload`, req.payload);

  res.status(200).json(req.payload);
});



module.exports = router;
