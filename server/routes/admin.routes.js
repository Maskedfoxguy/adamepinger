const express = require("express");
const { isValidObjectId } = require("mongoose");
const Admin = require("../models/Admin.model");
const Project = require("../models/Project.model");
const Skill = require("../models/Skill.model");
const About = require("../models/About.model");
const ContactInfo = require("../models/ContactInfo.model");
const { isAdmin } = require("../middleware/jwt.isAdmin");
const {
  isNonEmptyString,
  isStringArray,
  isValidUrl,
  isValidEmail,
  isPlainObject,
  parseDate,
} = require("../utils/validation");

function createAdminHandlers(models = {}) {
  const {
    AdminModel = Admin,
    ProjectModel = Project,
    SkillModel = Skill,
    AboutModel = About,
    ContactInfoModel = ContactInfo,
  } = models;

  const buildValidationError = (field, message) => ({ field, message });

  const sendValidationErrors = (res, errors) => {
    res.status(400).json({ errors });
  };

  const sanitizeString = (value) =>
    typeof value === "string" ? value.trim() : value;

  const validateProjectPayload = (payload, options = {}) => {
    const { requireAllFields = false, existingProject } = options;
    const errors = [];
    const sanitized = {};

    if (requireAllFields || payload.title !== undefined) {
      if (!isNonEmptyString(payload.title)) {
        errors.push(buildValidationError("title", "Project title is required."));
      } else {
        sanitized.title = sanitizeString(payload.title);
      }
    }

    if (requireAllFields || payload.description !== undefined) {
      if (!isNonEmptyString(payload.description)) {
        errors.push(
          buildValidationError("description", "Project description is required.")
        );
      } else {
        const description = sanitizeString(payload.description);
        if (description.length > 2000) {
          errors.push(
            buildValidationError(
              "description",
              "Description cannot exceed 2000 characters."
            )
          );
        } else {
          sanitized.description = description;
        }
      }
    }

    if (requireAllFields || payload.status !== undefined) {
      if (!isNonEmptyString(payload.status)) {
        errors.push(
          buildValidationError("status", "Project status must be provided.")
        );
      } else {
        const normalizedStatus = sanitizeString(payload.status).toLowerCase();
        if (!["ongoing", "completed"].includes(normalizedStatus)) {
          errors.push(
            buildValidationError(
              "status",
              "Project status must be either 'ongoing' or 'completed'."
            )
          );
        } else {
          sanitized.status = normalizedStatus;
        }
      }
    }

    if (requireAllFields || payload.startDate !== undefined) {
      const parsedStartDate = parseDate(payload.startDate);
      if (parsedStartDate === null) {
        errors.push(
          buildValidationError("startDate", "Start date must be a valid date.")
        );
      } else if (parsedStartDate === undefined) {
        errors.push(
          buildValidationError("startDate", "Project start date is required.")
        );
      } else {
        sanitized.startDate = parsedStartDate;
      }
    }

    if (
      requireAllFields ||
      Object.prototype.hasOwnProperty.call(payload, "endDate")
    ) {
      const rawEndDate = payload.endDate;
      if (rawEndDate === null || rawEndDate === "") {
        sanitized.endDate = undefined;
      } else {
        const parsedEndDate = parseDate(rawEndDate);
        if (parsedEndDate === null) {
          errors.push(
            buildValidationError("endDate", "End date must be a valid date.")
          );
        } else if (parsedEndDate !== undefined) {
          sanitized.endDate = parsedEndDate;
        }
      }
    }

    if (payload.technologies !== undefined) {
      if (!isStringArray(payload.technologies)) {
        errors.push(
          buildValidationError(
            "technologies",
            "Technologies must be an array of strings."
          )
        );
      } else {
        sanitized.technologies = payload.technologies
          .map((tech) => sanitizeString(tech))
          .filter(Boolean);
      }
    }

    if (payload.projectUrl !== undefined) {
      const projectUrl = sanitizeString(payload.projectUrl);
      if (projectUrl && !isValidUrl(projectUrl)) {
        errors.push(
          buildValidationError("projectUrl", "Project URL must be valid.")
        );
      } else if (projectUrl) {
        sanitized.projectUrl = projectUrl;
      }
    }

    if (payload.repositoryUrl !== undefined) {
      const repositoryUrl = sanitizeString(payload.repositoryUrl);
      if (repositoryUrl && !isValidUrl(repositoryUrl)) {
        errors.push(
          buildValidationError(
            "repositoryUrl",
            "Repository URL must be valid."
          )
        );
      } else if (repositoryUrl) {
        sanitized.repositoryUrl = repositoryUrl;
      }
    }

    if (payload.media !== undefined) {
      if (!isStringArray(payload.media)) {
        errors.push(
          buildValidationError("media", "Media must be an array of strings.")
        );
      } else {
        sanitized.media = payload.media
          .map((item) => sanitizeString(item))
          .filter(Boolean);
      }
    }

    const finalStatus =
      sanitized.status ?? existingProject?.status ?? undefined;
    const finalEndDate = Object.prototype.hasOwnProperty.call(
      sanitized,
      "endDate"
    )
      ? sanitized.endDate
      : existingProject?.endDate;
    const finalStartDate = sanitized.startDate ?? existingProject?.startDate;

    if (finalStatus === "completed" && !finalEndDate) {
      errors.push(
        buildValidationError(
          "endDate",
          "Completed projects must include an end date."
        )
      );
    }

    if (finalStartDate && finalEndDate && finalEndDate < finalStartDate) {
      errors.push(
        buildValidationError(
          "endDate",
          "End date cannot be earlier than the start date."
        )
      );
    }

    return { errors, sanitized };
  };

  const validateSkillPayload = (payload, options = {}) => {
    const { requireAllFields = false } = options;
    const errors = [];
    const sanitized = {};

    if (requireAllFields || payload.name !== undefined) {
      if (!isNonEmptyString(payload.name)) {
        errors.push(buildValidationError("name", "Skill name is required."));
      } else {
        sanitized.name = sanitizeString(payload.name);
      }
    }

    if (payload.category !== undefined) {
      if (payload.category !== null && typeof payload.category !== "string") {
        errors.push(
          buildValidationError("category", "Category must be a string if provided.")
        );
      } else if (payload.category) {
        sanitized.category = sanitizeString(payload.category);
      } else {
        sanitized.category = undefined;
      }
    }

    if (payload.level !== undefined) {
      if (payload.level !== null && typeof payload.level !== "string") {
        errors.push(
          buildValidationError("level", "Level must be a string if provided.")
        );
      } else if (payload.level) {
        sanitized.level = sanitizeString(payload.level);
      } else {
        sanitized.level = undefined;
      }
    }

    if (payload.description !== undefined) {
      if (payload.description !== null && typeof payload.description !== "string") {
        errors.push(
          buildValidationError(
            "description",
            "Description must be a string if provided."
          )
        );
      } else if (payload.description) {
        const description = sanitizeString(payload.description);
        if (description.length > 500) {
          errors.push(
            buildValidationError(
              "description",
              "Description cannot exceed 500 characters."
            )
          );
        } else {
          sanitized.description = description;
        }
      } else {
        sanitized.description = undefined;
      }
    }

    if (payload.iconUrl !== undefined) {
      const iconUrl = sanitizeString(payload.iconUrl);
      if (iconUrl && !isValidUrl(iconUrl)) {
        errors.push(buildValidationError("iconUrl", "Icon URL must be valid."));
      } else if (iconUrl) {
        sanitized.iconUrl = iconUrl;
      } else {
        sanitized.iconUrl = undefined;
      }
    }

    return { errors, sanitized };
  };

  const validateAboutPayload = (payload, options = {}) => {
    const { requireAllFields = false } = options;
    const errors = [];
    const sanitized = {};

    if (requireAllFields || payload.headline !== undefined) {
      if (!isNonEmptyString(payload.headline)) {
        errors.push(buildValidationError("headline", "Headline is required."));
      } else {
        sanitized.headline = sanitizeString(payload.headline);
      }
    }

    if (requireAllFields || payload.summary !== undefined) {
      if (!isNonEmptyString(payload.summary)) {
        errors.push(buildValidationError("summary", "Summary is required."));
      } else {
        const summary = sanitizeString(payload.summary);
        if (summary.length > 2000) {
          errors.push(
            buildValidationError(
              "summary",
              "Summary cannot exceed 2000 characters."
            )
          );
        } else {
          sanitized.summary = summary;
        }
      }
    }

    if (payload.highlights !== undefined) {
      if (!isStringArray(payload.highlights)) {
        errors.push(
          buildValidationError("highlights", "Highlights must be an array of strings.")
        );
      } else {
        sanitized.highlights = payload.highlights
          .map((highlight) => sanitizeString(highlight))
          .filter(Boolean);
      }
    }

    return { errors, sanitized };
  };

  const validateContactInfoPayload = (payload, options = {}) => {
    const { requireAllFields = false } = options;
    const errors = [];
    const sanitized = {};

    if (requireAllFields || payload.email !== undefined) {
      const email = sanitizeString(payload.email);
      if (!isValidEmail(email)) {
        errors.push(buildValidationError("email", "A valid email is required."));
      } else {
        sanitized.email = email;
      }
    }

    if (payload.phone !== undefined) {
      if (payload.phone !== null && typeof payload.phone !== "string") {
        errors.push(buildValidationError("phone", "Phone must be a string if provided."));
      } else if (payload.phone) {
        sanitized.phone = sanitizeString(payload.phone);
      } else {
        sanitized.phone = undefined;
      }
    }

    if (payload.location !== undefined) {
      if (payload.location !== null && typeof payload.location !== "string") {
        errors.push(
          buildValidationError("location", "Location must be a string if provided.")
        );
      } else if (payload.location) {
        sanitized.location = sanitizeString(payload.location);
      } else {
        sanitized.location = undefined;
      }
    }

    if (payload.availability !== undefined) {
      if (payload.availability !== null && typeof payload.availability !== "string") {
        errors.push(
          buildValidationError(
            "availability",
            "Availability must be a string if provided."
          )
        );
      } else if (payload.availability) {
        sanitized.availability = sanitizeString(payload.availability);
      } else {
        sanitized.availability = undefined;
      }
    }

    if (payload.socials !== undefined) {
      if (!Array.isArray(payload.socials)) {
        errors.push(
          buildValidationError("socials", "Social links must be provided as an array.")
        );
      } else {
        const socials = [];

        payload.socials.forEach((entry, index) => {
          if (!isPlainObject(entry)) {
            errors.push(
              buildValidationError(
                `socials[${index}]`,
                "Each social link must be an object with label and url fields."
              )
            );
            return;
          }

          const sanitizedEntry = {};

          if (entry.label !== undefined) {
            if (entry.label !== null && typeof entry.label !== "string") {
              errors.push(
                buildValidationError(
                  `socials[${index}].label`,
                  "Social label must be a string if provided."
                )
              );
            } else if (entry.label) {
              sanitizedEntry.label = sanitizeString(entry.label);
            }
          }

          if (entry.url !== undefined) {
            if (entry.url !== null && typeof entry.url !== "string") {
              errors.push(
                buildValidationError(
                  `socials[${index}].url`,
                  "Social URL must be a string if provided."
                )
              );
            } else if (entry.url) {
              const url = sanitizeString(entry.url);
              if (!isValidUrl(url)) {
                errors.push(
                  buildValidationError(
                    `socials[${index}].url`,
                    "Social URL must be valid if provided."
                  )
                );
              } else {
                sanitizedEntry.url = url;
              }
            }
          }

          if (Object.keys(sanitizedEntry).length > 0) {
            socials.push(sanitizedEntry);
          }
        });

        sanitized.socials = socials;
      }
    }

    return { errors, sanitized };
  };

  const getProfile = async (req, res, next) => {
    try {
      const adminId = req.payload._id;
      const admin = await AdminModel.findById(adminId).lean();

      if (!admin) {
        res.status(404).json({ message: "Admin not found." });
        return;
      }

      const { password, ...safeAdmin } = admin;
      res.status(200).json(safeAdmin);
    } catch (error) {
      next(error);
    }
  };

  const createProject = async (req, res, next) => {
    try {
      const { errors, sanitized } = validateProjectPayload(req.body, {
        requireAllFields: true,
      });

      if (errors.length > 0) {
        sendValidationErrors(res, errors);
        return;
      }

      const project = await ProjectModel.create(sanitized);
      res.status(201).json(project.toObject());
    } catch (error) {
      next(error);
    }
  };

  const updateProject = async (req, res, next) => {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
      res.status(400).json({ message: "Invalid project id." });
      return;
    }

    try {
      const project = await ProjectModel.findById(projectId);

      if (!project) {
        res.status(404).json({ message: "Project not found." });
        return;
      }

      const { errors, sanitized } = validateProjectPayload(req.body, {
        existingProject: project,
      });

      if (errors.length > 0) {
        sendValidationErrors(res, errors);
        return;
      }

      if (Object.keys(sanitized).length === 0) {
        res.status(400).json({ message: "Provide at least one field to update." });
        return;
      }

      project.set(sanitized);
      await project.save();

      res.status(200).json(project.toObject());
    } catch (error) {
      next(error);
    }
  };

  const deleteProject = async (req, res, next) => {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
      res.status(400).json({ message: "Invalid project id." });
      return;
    }

    try {
      const deletedProject = await ProjectModel.findByIdAndDelete(projectId).lean();

      if (!deletedProject) {
        res.status(404).json({ message: "Project not found." });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  const createSkill = async (req, res, next) => {
    try {
      const { errors, sanitized } = validateSkillPayload(req.body, {
        requireAllFields: true,
      });

      if (errors.length > 0) {
        sendValidationErrors(res, errors);
        return;
      }

      const skill = await SkillModel.create(sanitized);
      res.status(201).json(skill.toObject());
    } catch (error) {
      next(error);
    }
  };

  const updateSkill = async (req, res, next) => {
    const { skillId } = req.params;

    if (!isValidObjectId(skillId)) {
      res.status(400).json({ message: "Invalid skill id." });
      return;
    }

    try {
      const skill = await SkillModel.findById(skillId);

      if (!skill) {
        res.status(404).json({ message: "Skill not found." });
        return;
      }

      const { errors, sanitized } = validateSkillPayload(req.body);

      if (errors.length > 0) {
        sendValidationErrors(res, errors);
        return;
      }

      if (Object.keys(sanitized).length === 0) {
        res.status(400).json({ message: "Provide at least one field to update." });
        return;
      }

      skill.set(sanitized);
      await skill.save();

      res.status(200).json(skill.toObject());
    } catch (error) {
      next(error);
    }
  };

  const deleteSkill = async (req, res, next) => {
    const { skillId } = req.params;

    if (!isValidObjectId(skillId)) {
      res.status(400).json({ message: "Invalid skill id." });
      return;
    }

    try {
      const deletedSkill = await SkillModel.findByIdAndDelete(skillId).lean();

      if (!deletedSkill) {
        res.status(404).json({ message: "Skill not found." });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  const createAbout = async (req, res, next) => {
    try {
      const { errors, sanitized } = validateAboutPayload(req.body, {
        requireAllFields: true,
      });

      if (errors.length > 0) {
        sendValidationErrors(res, errors);
        return;
      }

      const about = await AboutModel.create(sanitized);
      res.status(201).json(about.toObject());
    } catch (error) {
      next(error);
    }
  };

  const updateAbout = async (req, res, next) => {
    const { aboutId } = req.params;

    if (!isValidObjectId(aboutId)) {
      res.status(400).json({ message: "Invalid about id." });
      return;
    }

    try {
      const about = await AboutModel.findById(aboutId);

      if (!about) {
        res.status(404).json({ message: "About entry not found." });
        return;
      }

      const { errors, sanitized } = validateAboutPayload(req.body);

      if (errors.length > 0) {
        sendValidationErrors(res, errors);
        return;
      }

      if (Object.keys(sanitized).length === 0) {
        res.status(400).json({ message: "Provide at least one field to update." });
        return;
      }

      about.set(sanitized);
      await about.save();

      res.status(200).json(about.toObject());
    } catch (error) {
      next(error);
    }
  };

  const deleteAbout = async (req, res, next) => {
    const { aboutId } = req.params;

    if (!isValidObjectId(aboutId)) {
      res.status(400).json({ message: "Invalid about id." });
      return;
    }

    try {
      const deletedAbout = await AboutModel.findByIdAndDelete(aboutId).lean();

      if (!deletedAbout) {
        res.status(404).json({ message: "About entry not found." });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  const createContact = async (req, res, next) => {
    try {
      const { errors, sanitized } = validateContactInfoPayload(req.body, {
        requireAllFields: true,
      });

      if (errors.length > 0) {
        sendValidationErrors(res, errors);
        return;
      }

      const contactInfo = await ContactInfoModel.create(sanitized);
      res.status(201).json(contactInfo.toObject());
    } catch (error) {
      next(error);
    }
  };

  const updateContact = async (req, res, next) => {
    const { contactInfoId } = req.params;

    if (!isValidObjectId(contactInfoId)) {
      res.status(400).json({ message: "Invalid contact info id." });
      return;
    }

    try {
      const contactInfo = await ContactInfoModel.findById(contactInfoId);

      if (!contactInfo) {
        res.status(404).json({ message: "Contact info not found." });
        return;
      }

      const { errors, sanitized } = validateContactInfoPayload(req.body);

      if (errors.length > 0) {
        sendValidationErrors(res, errors);
        return;
      }

      if (Object.keys(sanitized).length === 0) {
        res.status(400).json({ message: "Provide at least one field to update." });
        return;
      }

      contactInfo.set(sanitized);
      await contactInfo.save();

      res.status(200).json(contactInfo.toObject());
    } catch (error) {
      next(error);
    }
  };

  const deleteContact = async (req, res, next) => {
    const { contactInfoId } = req.params;

    if (!isValidObjectId(contactInfoId)) {
      res.status(400).json({ message: "Invalid contact info id." });
      return;
    }

    try {
      const deletedContactInfo = await ContactInfoModel.findByIdAndDelete(
        contactInfoId
      ).lean();

      if (!deletedContactInfo) {
        res.status(404).json({ message: "Contact info not found." });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  return {
    handlers: {
      getProfile,
      createProject,
      updateProject,
      deleteProject,
      createSkill,
      updateSkill,
      deleteSkill,
      createAbout,
      updateAbout,
      deleteAbout,
      createContact,
      updateContact,
      deleteContact,
    },
    validation: {
      buildValidationError,
      sendValidationErrors,
      sanitizeString,
      validateProjectPayload,
      validateSkillPayload,
      validateAboutPayload,
      validateContactInfoPayload,
    },
  };
}

function createAdminRouter(options = {}) {
  const {
    AdminModel = Admin,
    ProjectModel = Project,
    SkillModel = Skill,
    AboutModel = About,
    ContactInfoModel = ContactInfo,
    isAdminMiddleware = isAdmin,
  } = options;

  const { handlers, validation } = createAdminHandlers({
    AdminModel,
    ProjectModel,
    SkillModel,
    AboutModel,
    ContactInfoModel,
  });

  const router = express.Router();
  router.use(isAdminMiddleware);

  router.get("/profile", handlers.getProfile);
  router.post("/portfolio", handlers.createProject);
  router.put("/portfolio/:projectId", handlers.updateProject);
  router.delete("/portfolio/:projectId", handlers.deleteProject);

  router.post("/skills", handlers.createSkill);
  router.put("/skills/:skillId", handlers.updateSkill);
  router.delete("/skills/:skillId", handlers.deleteSkill);

  router.post("/about", handlers.createAbout);
  router.put("/about/:aboutId", handlers.updateAbout);
  router.delete("/about/:aboutId", handlers.deleteAbout);

  router.post("/contact", handlers.createContact);
  router.put("/contact/:contactInfoId", handlers.updateContact);
  router.delete("/contact/:contactInfoId", handlers.deleteContact);

  return { router, handlers, validation };
}

const { router, handlers, validation } = createAdminRouter();

module.exports = router;
module.exports.createAdminRouter = createAdminRouter;
module.exports.createAdminHandlers = createAdminHandlers;
module.exports.handlers = handlers;
module.exports.validation = validation;
