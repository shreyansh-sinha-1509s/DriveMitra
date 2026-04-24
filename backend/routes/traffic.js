const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { routeName, status, reportedBy } = req.body;

  const sql = `
    INSERT INTO traffic_updates (route_name, status, reported_by)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [routeName, status, reportedBy], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    res.json({
      id: result.insertId,
      routeName,
      status,
      reportedBy
    });
  });
});

router.get("/latest/:routeName", (req, res) => {
  const sql = `
    SELECT * FROM traffic_updates
    WHERE route_name = ?
    ORDER BY created_at DESC
    LIMIT 1
  `;

  db.query(sql, [req.params.routeName], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results[0] || {});
  });
});

router.get("/", (req, res) => {
  const sql = "SELECT * FROM traffic_updates ORDER BY created_at DESC";
  db.query(sql, [], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;