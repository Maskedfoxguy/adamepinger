const express = require("express");
const ContactInfo = require("../models/ContactInfo.model");

function createContactHandlers(ContactModel = ContactInfo) {
  const getLatestContact = async (req, res, next) => {
    try {
      const contactInfo = await ContactModel.findOne().sort({ updatedAt: -1 }).lean();

      if (!contactInfo) {
        res.status(404).json({ message: "Contact information not found." });
        return;
      }

      res.status(200).json(contactInfo);
    } catch (error) {
      next(error);
    }
  };

  return { getLatestContact };
}

function createContactRouter(options = {}) {
  const { ContactModel = ContactInfo } = options;
  const handlers = createContactHandlers(ContactModel);
  const router = express.Router();

  router.get("/", handlers.getLatestContact);

  return { router, handlers };
}

const { router, handlers } = createContactRouter();

module.exports = router;
module.exports.createContactRouter = createContactRouter;
module.exports.createContactHandlers = createContactHandlers;
module.exports.handlers = handlers;
