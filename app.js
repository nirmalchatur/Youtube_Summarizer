// app.js

const { exec } = require("child_process");
const path = require("path");

// 🔄 Start backend (folder: backend)
exec("npm start", { cwd: path.join(__dirname, "backend") }, (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Backend error:", err.message);
    return;
  }
  console.log("✅ Backend output:\n", stdout);
  if (stderr) console.error("⚠️ Backend stderr:\n", stderr);
});

// 🌐 Start frontend (folder: video-summarizer-frontend)
exec("npm start", { cwd: path.join(__dirname, "video-summarizer-frontend") }, (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Frontend error:", err.message);
    return;
  }
  console.log("✅ Frontend output:\n", stdout);
  if (stderr) console.error("⚠️ Frontend stderr:\n", stderr);
});
