const { Schema, model } = require("mongoose");

const professionalJourneySchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required."],
    },
    duration: {
      startYear: {
        type: Number,
        required: [true, "Start year is required."],
      },
      startMonth: {
        type: String,
        required: [true, "Start month is required."],
      },
      endYear: {
        type: Number,
        required: false,
      },
      endMonth: {
        type: String,
        required: false,
      },
    },
    title: {
      type: String,
      required: [true, "Job title is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      maxlength: [2000, "Description cannot exceed 2000 characters."],
    },
    achievements: [
      {
        type: String,
        required: false,
      },
    ],
    companyUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid URL for the company."],
    },
    linkedInUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid LinkedIn URL."],
    },
  },
  { timestamps: true }
);

module.exports = model("ProfessionalJourney", professionalJourneySchema);
