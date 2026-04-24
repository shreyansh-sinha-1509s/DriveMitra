const Database = require('better-sqlite3');
const db = new Database('drivemitra.db'); 

const drivers = [
  ['Rahul Sharma', 'MH04AB1234', '9876543210'],
  ['Amit Yadav', 'MH48CD5678', '9867543211'],
  ['Rohit Singh', 'MH02EF9012', '9856543212'],
  ['Vikas Kumar', 'MH01GH3456', '9845543213'],
  ['Sanjay Patel', 'MH47IJ7890', '9834543214'],
  ['Deepak Verma', 'MH05KL1122', '9823543215'],
  ['Manoj Gupta', 'MH03MN3344', '9812543216'],
  ['Karan Mehta', 'MH06OP5566', '9801543217'],
  ['Nitin Joshi', 'MH09QR7788', '9790543218'],
  ['Arjun Tiwari', 'MH14ST9900', '9789543219']
];

const insertDriver = db.prepare("INSERT OR IGNORE INTO drivers (name, vehicle_number, mobile) VALUES (?, ?, ?)");
db.transaction(() => {
  for (const driver of drivers) insertDriver.run(...driver);
})();

// Random generation for slips, feedback, traffic
const locations = ['Bandra', 'Andheri', 'Borivali', 'Dadar', 'Kurla', 'Vasai', 'Virar', 'Mira Road', 'Goregaon', 'Malad'];
const items = ['Electronics', 'Furniture', 'Groceries', 'Clothing', 'Hardware', 'Medicines', 'Stationery'];
const statuses = ['Good', 'Moderate', 'Average', 'Busy'];
const comments = ['Great service!', 'On time.', 'A bit late due to traffic.', 'Very professional.', 'Handle with care was followed.', 'Could be faster.', 'Good driver.', 'Fast delivery!'];

const insertSlip = db.prepare("INSERT INTO slips (slip_id, driver_name, vehicle_number, customer_name, item_type, quantity, location) VALUES (?, ?, ?, ?, ?, ?, ?)");
const insertFeedback = db.prepare("INSERT INTO feedback (slip_id, customer_name, customer_location, driver_name, item_type, quantity, rating, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
const insertTraffic = db.prepare("INSERT INTO traffic_updates (route_name, status, reported_by) VALUES (?, ?, ?)");

db.transaction(() => {
  for(let i = 0; i < 20; i++) {
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const slipId = "SLIP-" + Date.now() + i;
    const customer = "Customer " + Math.floor(Math.random() * 100);
    const location = locations[Math.floor(Math.random() * locations.length)];
    const item = items[Math.floor(Math.random() * items.length)];
    const qty = Math.floor(Math.random() * 50) + 1;
    
    // Insert Slip
    insertSlip.run(slipId, driver[0], driver[1], customer, item, qty, location);
    
    // Insert Feedback (80% chance)
    if (Math.random() > 0.2) {
      const rating = Math.floor(Math.random() * 3) + 3; // 3 to 5
      const comment = comments[Math.floor(Math.random() * comments.length)];
      insertFeedback.run(slipId, customer, location, driver[0], item, qty, rating, comment);
    }
    
    // Insert Traffic Updates
    const route = location;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    insertTraffic.run(route, status, driver[0]);
  }
})();

console.log('Seeding completed successfully!');
