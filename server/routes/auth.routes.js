const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.model");

const { isAuthenticated, resolveTokenSecret } = require("../middleware/jwt.middleware");

const tokenSecret = resolveTokenSecret();

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  try {
    const foundAdmin = await Admin.findOne({ email });

    if (!foundAdmin) {
      res.status(401).json({ message: "Admin not found." });
      return;
    }

    const passwordCorrect = await bcrypt.compare(password, foundAdmin.password);

    if (!passwordCorrect) {
      res.status(401).json({ message: "Unable to authenticate the user" });
      return;
    }

    const { _id, firstName, lastName, role } = foundAdmin;
    const payload = { _id, email, firstName, lastName, role };

    req.admin = payload;

    const authToken = jwt.sign(payload, tokenSecret, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken });
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
