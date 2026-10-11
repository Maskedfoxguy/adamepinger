
require("dotenv").config();
const mongoose = require("mongoose");

async function copyAdmin() {
  try {
    // Use your existing MongoDB Atlas connection string
    await mongoose.connect(process.env.MONGODB_URI);

    // Access both databases within the same MongoDB cluster
    const source = mongoose.connection.useDb("test");
    const destination = mongoose.connection.useDb("resumesite");

    const oldAdmins = source.collection("admins");
    const newAdmins = destination.collection("admins");

    // Read the original admin without changing the password hash
    const admin = await oldAdmins.findOne({ email: "admin@example.com" });

    if (!admin) {
      console.log("Original admin not found in test database.");
      return;
    }

    // Avoid creating a duplicate admin
    const existing = await newAdmins.findOne({ email: admin.email });

    if (existing) {
      console.log("Admin already exists in resumesite.");
      return;
    }

    // Copy the exact document, including its hashed password
    await newAdmins.insertOne(admin);

    console.log("Admin copied successfully to resumesite!");
  } catch (error) {
    console.error("Copy failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

copyAdmin();
