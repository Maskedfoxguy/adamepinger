const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    profileImageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    displayName: {
      type: String,
      trim: true,
      default: "",
    },

    passwordChangedAt: {
      type: Date,
    },

    resetPasswordTokenHash: {
      type: String,
      default: null,
    },

    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    lastLoginIp: {
      type: String,
      trim: true,
      default: "",
    },

    lastLoginUserAgent: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function hashPassword(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);

    if (!this.isNew) {
      this.passwordChangedAt = new Date();
      this.resetPasswordTokenHash = null;
      this.resetPasswordExpiresAt = null;
    }
  }

  next();
});

module.exports = model("Admin", adminSchema);