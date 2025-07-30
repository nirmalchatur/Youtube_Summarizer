<<<<<<< HEAD
// app.js
const { exec } = require("child_process");
const path = require("path");

// 🔄 Start backend
exec("npm start", { cwd: path.join(__dirname, "backend") }, (err, stdout, stderr) => {
  if (err) {
    console.error("Backend error:", err.message);
    return;
  }
  console.log("Backend output:", stdout);
  if (stderr) console.error("Backend stderr:", stderr);
});

// 🌐 Start frontend
exec("npm start", { cwd: path.join(__dirname, "video-summarizer-frontend") }, (err, stdout, stderr) => {
  if (err) {
    console.error("Frontend error:", err.message);
    return;
  }
  console.log("Frontend output:", stdout);
  if (stderr) console.error("Frontend stderr:", stderr);
=======
// app.js
const { exec } = require("child_process");
const path = require("path");

// 🔄 Start backend
exec("npm start", { cwd: path.join(__dirname, "backend") }, (err, stdout, stderr) => {
  if (err) {
    console.error("Backend error:", err.message);
    return;
  }
  console.log("Backend output:", stdout);
  if (stderr) console.error("Backend stderr:", stderr);
});

// 🌐 Start frontend
exec("npm start", { cwd: path.join(__dirname, "video-summarizer-frontend") }, (err, stdout, stderr) => {
  if (err) {
    console.error("Frontend error:", err.message);
    return;
  }
  console.log("Frontend output:", stdout);
  if (stderr) console.error("Frontend stderr:", stderr);
>>>>>>> 53dc0f77f377d53396d025dbb977843331c82245
});