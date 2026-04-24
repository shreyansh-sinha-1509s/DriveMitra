const express = require("express");
const router = express.Router();
const db = require("../db");

// Create slip
router.post("/", (req, res) => {
  const { driverName, vehicleNumber, customerName, itemType, quantity, location } = req.body;

  if (!driverName || !vehicleNumber || !customerName || !itemType || !quantity || !location) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const slipId = "SLIP-" + Date.now();

  const sql = `
    INSERT INTO slips (slip_id, driver_name, vehicle_number, customer_name, item_type, quantity, location)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [slipId, driverName, vehicleNumber, customerName, itemType, quantity, location],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to create slip." });
      }

      res.status(201).json({
        slipId,
        driverName,
        vehicleNumber,
        customerName,
        itemType,
        quantity,
        location
      });
    }
  );
});

// Get slip by slipId
router.get("/:id", (req, res) => {
  const slipId = req.params.id;

  const sql = `
    SELECT
      slip_id AS slipId,
      driver_name AS driverName,
      vehicle_number AS vehicleNumber,
      customer_name AS customerName,
      item_type AS itemType,
      quantity,
      location
    FROM slips
    WHERE slip_id = ?
  `;

  db.query(sql, [slipId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch slip." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Slip not found." });
    }

    res.json(results[0]);
  });
});

router.get("/driver/:vehicleNo", (req, res) => {
  const sql = "SELECT slip_id AS slipId, driver_name AS driverName, vehicle_number AS vehicleNumber, customer_name AS customerName, item_type AS itemType, quantity, location, created_at AS createdAt FROM slips WHERE vehicle_number = ? ORDER BY created_at DESC";
  db.query(sql, [req.params.vehicleNo], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

router.get("/", (req, res) => {
  const sql = "SELECT slip_id AS slipId, driver_name AS driverName, vehicle_number AS vehicleNumber, customer_name AS customerName, item_type AS itemType, quantity, location, created_at AS createdAt FROM slips ORDER BY created_at DESC";
  db.query(sql, [], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;