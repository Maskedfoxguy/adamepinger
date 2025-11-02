// Usage:
//   node server/scripts/seed-admin.js "Ada" "Lovelace" "ada@example.com" "P@ssw0rd123"
// Requires MONGODB_URI in .env (or falls back to local)
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin.model");

const [firstName, lastName, email, password] = process.argv.slice(2);

async function main() {
  if (!firstName || !lastName || !email || !password) {
    console.error("Usage: node server/scripts/seed-admin.js <firstName> <lastName> <email> <password>");
    process.exit(1);
  }

  const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/resumesite";
  console.log("Connecting to:", MONGO_URI);
  await mongoose.connect(MONGO_URI);

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists for email:", email);
    await mongoose.disconnect();
    return;
  }

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password, // pre-save hook will hash
    role: "admin",
  });

  console.log("Seeded admin:", { id: admin._id.toString(), email: admin.email });
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try { await mongoose.disconnect(); } catch (disconnectErr) {
    // Ignore disconnect errors during error handling
  }
  process.exit(1);
});