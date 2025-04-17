const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");  // Importing the CORS package
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create uploads folder if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending timestamp to ensure unique filenames
  },
});

// Initialize multer upload middleware
const upload = multer({ storage: storage });

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the "public" folder (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Handle the POST request for file upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Generate a link to access the uploaded file
  const fileLink = `http://localhost:${port}/uploads/${req.file.filename}`;

  // Respond with the file link
  res.json({ link: fileLink });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
