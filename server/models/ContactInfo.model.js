const { Schema, model } = require("mongoose");

const contactInfoSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/.+@.+\..+/, "Please enter a valid email address."],
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      trim: true,
    },
    socials: [
      {
        label: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          match: [/^https?:\/\/.+/, "Please provide a valid URL."],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("ContactInfo", contactInfoSchema);
