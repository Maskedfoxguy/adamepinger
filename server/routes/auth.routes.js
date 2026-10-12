
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Admin = require("../models/Admin.model");
const AdminSession = require("../models/AdminSession.model");

const {
  isAuthenticated,
  resolveTokenSecret,
} = require("../middleware/jwt.middleware");

const tokenSecret = resolveTokenSecret();

const router = express.Router();

// Maximum total session lifetime: 6 hours.
const MAX_SESSION_AGE = 6 * 60 * 60 * 1000;

// ADMIN LOGIN
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: "Provide email and password.",
    });
  }

  try {
    const foundAdmin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!foundAdmin) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      foundAdmin.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate a unique ID for this login session.
    const sessionId = crypto.randomUUID();
    const now = Date.now();

    // Store the session in MongoDB.
    await AdminSession.create({
      sessionId,
      adminId: foundAdmin._id,
      lastActivity: new Date(now),
      expiresAt: new Date(now + MAX_SESSION_AGE),
    });

    const payload = {
      _id: foundAdmin._id,
      email: foundAdmin.email,
      firstName: foundAdmin.firstName,
      lastName: foundAdmin.lastName,
      role: foundAdmin.role,
      sid: sessionId,
    };

    // Keep the existing six-hour maximum JWT lifetime.
    const authToken = jwt.sign(payload, tokenSecret, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken });
  } catch (error) {
    next(error);
  }
});

// VERIFY SESSION
router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

// ACTIVITY HEARTBEAT
router.post("/heartbeat", isAuthenticated, (req, res) => {
  res.status(200).json({
    message: "Session active.",
  });
});

// MANUAL LOGOUT
router.post("/logout", isAuthenticated, async (req, res, next) => {
  try {
    await AdminSession.updateOne(
      {
        sessionId: req.payload.sid,
        adminId: req.payload._id,
      },
      {
        $set: { revoked: true },
      }
    );

    res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
