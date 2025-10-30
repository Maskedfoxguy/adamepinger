// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

// Public API endpoints expose read-only portfolio data.
const projectRoutes = require("./routes/project.routes");
app.use("/api/portfolio", projectRoutes);

const skillsRoutes = require("./routes/skills.routes");
app.use("/api/skills", skillsRoutes);

const aboutRoutes = require("./routes/about.routes");
app.use("/api/about", aboutRoutes);

const contactRoutes = require("./routes/contact.routes");
app.use("/api/contact", contactRoutes);

// Authentication endpoints are separated so the login route stays hidden from public docs.
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// Guard all admin routes with JWT authentication before enforcing admin role checks.
const { isAuthenticated } = require("./middleware/jwt.middleware");
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", isAuthenticated, adminRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);


module.exports = app;
