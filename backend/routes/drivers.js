const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/register", (req, res) => {
  const { name, vehicleNumber, mobile } = req.body;

  if (!name || !vehicleNumber || !mobile) {
    return res.status(400).json({
      message: "Name, vehicle number and mobile number are required"
    });
  }

  const checkSql = "SELECT id FROM drivers WHERE vehicle_number = ?";
  db.query(checkSql, [vehicleNumber], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(409).json({
        message: "This vehicle is already registered. Please login instead."
      });
    }

    const insertSql =
      "INSERT INTO drivers (name, vehicle_number, mobile) VALUES (?, ?, ?)";

    db.query(insertSql, [name, vehicleNumber, mobile], (insertErr, result) => {
      if (insertErr) return res.status(500).json({ message: insertErr.message });

      return res.status(201).json({
        id: result.insertId,
        name,
        vehicleNumber,
        mobile,
        message: "Registration successful"
      });
    });
  });
});

router.post("/login", (req, res) => {
  const { name, vehicleNumber } = req.body;

  if (!name || !vehicleNumber) {
    return res.status(400).json({
      message: "Name and vehicle number are required"
    });
  }

  const loginSql =
    "SELECT id, name, vehicle_number, mobile FROM drivers WHERE name = ? AND vehicle_number = ? LIMIT 1";

  db.query(loginSql, [name, vehicleNumber], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials. Please check your name and vehicle number."
      });
    }

    const driver = results[0];
    return res.json({
      id: driver.id,
      name: driver.name,
      vehicleNumber: driver.vehicle_number,
      mobile: driver.mobile,
      message: "Login successful"
    });
  });
});

module.exports = router;
