const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Please enter a valid email address."],
    },
    message: {
      type: String,
      required: [true, "Please write your message here."],
    },
  },
  { timestamps: true }
);

module.exports = model("Contact", contactSchema);
