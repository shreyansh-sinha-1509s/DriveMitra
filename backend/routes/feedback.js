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

router.get("/driver/:driverName", (req, res) => {
  const sql = "SELECT * FROM feedback WHERE driver_name = ? ORDER BY created_at DESC";

  db.query(sql, [req.params.driverName], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;