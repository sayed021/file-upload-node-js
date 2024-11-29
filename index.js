const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Ensure public/uploads directory exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set destination inside public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use timestamped file naming
  },
});

// Middleware for file uploads
const upload = multer({ storage });

// Serve static files (like uploaded files) from the public directory
app.use(express.static("public"));

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = `/uploads/${req.file.filename}`; // Path relative to public
  res.send(`
    <h1>File Uploaded Successfully</h1>
    <p>File Path: <a href="${filePath}" target="_blank"><img src="${filePath}" /></a></p>
    <a href="/">Go Back</a>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
