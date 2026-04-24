const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    slipId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerLocation: { type: String, required: true },
    driverName: { type: String, required: true },
    itemType: { type: String, required: true },
    quantity: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);