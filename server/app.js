require("dotenv").config();
require("./db");
const express = require("express");

const app = express();

require("./config")(app);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const projectRoutes = require("./routes/project.routes");
app.use("/api/portfolio", projectRoutes);

const skillsRoutes = require("./routes/skills.routes");
app.use("/api/skills", skillsRoutes);

const aboutRoutes = require("./routes/about.routes");
app.use("/api/about", aboutRoutes);

const contactRoutes = require("./routes/contact.routes");
app.use("/api/contact", contactRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const { isAuthenticated } = require("./middleware/jwt.middleware");
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", isAuthenticated, adminRoutes);

require("./error-handling")(app);

module.exports = app;
