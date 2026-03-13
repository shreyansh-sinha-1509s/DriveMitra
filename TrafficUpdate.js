const mongoose = require("mongoose");

const trafficUpdateSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true },
    status: {
      type: String,
      enum: ["Good", "Moderate", "Average", "Busy"],
      required: true
    },
    reportedBy: { type: String, default: "Anonymous Driver" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrafficUpdate", trafficUpdateSchema);