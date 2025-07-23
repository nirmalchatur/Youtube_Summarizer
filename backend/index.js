const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const videoRoutes = require("./routes/videoRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Required to parse JSON request body

// 👇 Important: Use your route here
app.use("/api/video", videoRoutes); // 
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
process.on('uncaughtException', err => {
  console.error("Uncaught Exception:", err);
});

process.on('unhandledRejection', reason => {
  console.error("Unhandled Rejection:", reason);
});
