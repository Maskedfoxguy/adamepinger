const express = require("express");
const About = require("../models/About.model");

function createAboutHandlers(AboutModel = About) {
  const getLatestAbout = async (req, res, next) => {
    try {
      const about = await AboutModel.findOne().sort({ updatedAt: -1 }).lean();

      if (!about) {
        res.status(404).json({ message: "About information not found." });
        return;
      }

      res.status(200).json(about);
    } catch (error) {
      next(error);
    }
  };

  return { getLatestAbout };
}

function createAboutRouter(options = {}) {
  const { AboutModel = About } = options;
  const handlers = createAboutHandlers(AboutModel);
  const router = express.Router();

  router.get("/", handlers.getLatestAbout);

  return { router, handlers };
}

const { router, handlers } = createAboutRouter();

module.exports = router;
module.exports.createAboutRouter = createAboutRouter;
module.exports.createAboutHandlers = createAboutHandlers;
module.exports.handlers = handlers;
