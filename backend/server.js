const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/drivers", require("./routes/drivers"));
app.use("/api/slips", require("./routes/slips"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/traffic", require("./routes/traffic"));

app.get("/", (req, res) => {
  res.send("DriveMitra backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});