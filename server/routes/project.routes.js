const express = require("express");
const { isValidObjectId } = require("mongoose");
const Project = require("../models/Project.model");

function createProjectHandlers(ProjectModel = Project) {
  const listProjects = async (req, res, next) => {
    try {
      const projects = await ProjectModel.find().sort({ startDate: -1 }).lean();
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  };

  const getProjectById = async (req, res, next) => {
    const { projectId } = req.params;

    try {
      if (!isValidObjectId(projectId)) {
        res.status(400).json({ message: "Invalid project id." });
        return;
      }

      const project = await ProjectModel.findById(projectId).lean();

      if (!project) {
        res.status(404).json({ message: "Project not found." });
        return;
      }

      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  };

  return { listProjects, getProjectById };
}

function createProjectRouter(options = {}) {
  const { ProjectModel = Project } = options;
  const handlers = createProjectHandlers(ProjectModel);
  const router = express.Router();

  router.get("/", handlers.listProjects);
  router.get("/:projectId", handlers.getProjectById);

  return { router, handlers };
}

const { router, handlers } = createProjectRouter();

module.exports = router;
module.exports.createProjectRouter = createProjectRouter;
module.exports.createProjectHandlers = createProjectHandlers;
module.exports.handlers = handlers;
