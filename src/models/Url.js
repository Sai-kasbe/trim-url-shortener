const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },

    clickEvents: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        userAgent: String,
      },
    ],
  },
  { timestamps: true }
);

// Speeds up "list all links, newest first" used by GET /api/urls.
// shortCode already has an index automatically from `unique: true` above.
urlSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Url", urlSchema);