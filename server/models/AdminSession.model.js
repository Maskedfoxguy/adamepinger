
const { Schema, model } = require("mongoose");

const adminSessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    lastActivity: {
      type: Date,
      required: true,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("AdminSession", adminSessionSchema);
