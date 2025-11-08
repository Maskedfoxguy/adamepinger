const { Schema, model } = require("mongoose");

const skillSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required."],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters."],
    },
    iconUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Please provide a valid icon URL."],
    },
  },
  { timestamps: true }
);

module.exports = model("Skill", skillSchema);
