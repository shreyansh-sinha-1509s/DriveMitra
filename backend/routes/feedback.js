const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const {
    slipId,
    customerName,
    customerLocation,
    driverName,
    itemType,
    quantity,
    rating,
    comment
  } = req.body;

  const sql = `
    INSERT INTO feedback
    (slip_id, customer_name, customer_location, driver_name, item_type, quantity, rating, comment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [slipId, customerName, customerLocation, driverName, itemType, quantity, rating, comment || ""],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ id: result.insertId, message: "Feedback submitted successfully" });
    }
  );
});

router.get("/driver/:vehicleNo", (req, res) => {
  const sql = `
    SELECT f.* 
    FROM feedback f 
    JOIN slips s ON f.slip_id = s.slip_id 
    WHERE s.vehicle_number = ? 
    ORDER BY f.created_at DESC
  `;

  db.query(sql, [req.params.vehicleNo], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;