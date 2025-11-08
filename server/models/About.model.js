const { Schema, model } = require("mongoose");

const aboutSchema = new Schema(
  {
    headline: {
      type: String,
      required: [true, "Headline is required."],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "Summary is required."],
      maxlength: [2000, "Summary cannot exceed 2000 characters."],
    },
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("About", aboutSchema);
