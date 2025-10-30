// Exposes read-only skill information for the public portfolio.
const express = require("express");
const Skill = require("../models/Skill.model");

function createSkillsHandlers(SkillModel = Skill) {
  const listSkills = async (req, res, next) => {
    try {
      const skills = await SkillModel.find().sort({ name: 1 }).lean();
      res.status(200).json(skills);
    } catch (error) {
      next(error);
    }
  };

  return { listSkills };
}

function createSkillsRouter(options = {}) {
  const { SkillModel = Skill } = options;
  const handlers = createSkillsHandlers(SkillModel);
  const router = express.Router();

  router.get("/", handlers.listSkills);

  return { router, handlers };
}

const { router, handlers } = createSkillsRouter();

module.exports = router;
module.exports.createSkillsRouter = createSkillsRouter;
module.exports.createSkillsHandlers = createSkillsHandlers;
module.exports.handlers = handlers;
