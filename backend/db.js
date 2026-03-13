const Database = require("better-sqlite3");
const path = require("path");

// Open (or create) the SQLite database file next to this script
const db = new Database(path.join(__dirname, "drivemitra.db"));

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// ── Auto-create tables on startup ────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS drivers (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    vehicle_number  TEXT    NOT NULL UNIQUE,
    mobile          TEXT    NOT NULL,
    created_at      TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS slips (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    slip_id         TEXT    NOT NULL UNIQUE,
    driver_name     TEXT    NOT NULL,
    vehicle_number  TEXT    NOT NULL,
    customer_name   TEXT    NOT NULL,
    item_type       TEXT    NOT NULL,
    quantity        INTEGER NOT NULL,
    location        TEXT    NOT NULL,
    created_at      TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    slip_id           TEXT    NOT NULL,
    customer_name     TEXT    NOT NULL,
    customer_location TEXT    NOT NULL,
    driver_name       TEXT    NOT NULL,
    item_type         TEXT    NOT NULL,
    quantity          INTEGER NOT NULL,
    rating            INTEGER NOT NULL,
    comment           TEXT,
    created_at        TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS traffic_updates (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    route_name  TEXT    NOT NULL,
    status      TEXT    NOT NULL,
    reported_by TEXT    NOT NULL,
    created_at  TEXT    DEFAULT (datetime('now'))
  );
`);

console.log("SQLite connected – database ready at drivemitra.db");

// ── MySQL-compatible query shim ───────────────────────────────────────────────
// Routes call:  db.query(sql, params, callback)
// callback signature: (err, results)
// For INSERT, results has: { insertId }
// For SELECT, results is an array of row objects
const connection = {
  query(sql, params, cb) {
    try {
      const stmt = db.prepare(sql);
      const trimmed = sql.trim().toUpperCase();

      if (trimmed.startsWith("INSERT")) {
        const info = stmt.run(...(params || []));
        cb(null, { insertId: info.lastInsertRowid });
      } else if (trimmed.startsWith("UPDATE") || trimmed.startsWith("DELETE")) {
        const info = stmt.run(...(params || []));
        cb(null, { affectedRows: info.changes });
      } else {
        // SELECT
        const rows = stmt.all(...(params || []));
        cb(null, rows);
      }
    } catch (err) {
      cb(err, null);
    }
  }
};

module.exports = connection;
