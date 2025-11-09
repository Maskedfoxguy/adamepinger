const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required."],
    },
    description: {
      type: String,
      required: [true, "Project description is required."],
      maxlength: [2000, "Description cannot exceed 2000 characters."],
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      required: [true, "Project status is required."],
    },
    technologies: [
      {
        type: String,
      },
    ],
    startDate: {
      type: Date,
      required: [true, "Project start date is required."],
    },
    endDate: {
      type: Date,
      required: function requireEndDate() {
        return this.status === "completed";
      },
    },
    projectUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid URL for the project."],
    },
    repositoryUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid repository URL."],
    },
    media: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Project", projectSchema);
