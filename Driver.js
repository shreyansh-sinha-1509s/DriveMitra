const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicleNumber: { type: String, required: true, unique: true },
    mobile: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);