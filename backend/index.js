const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require('./routes/postRoutes');
const messageRoute = require("./routes/messageRoutes");
const v2 = require("cloudinary");
const cloudinary = v2;
const { server, app } = require("./socket/socket");
const path = require("path");
const cors = require("cors");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend URL from environment or default to localhost
  methods: ["GET", "POST"],
  credentials: true
}));

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

// Middleware
app.use(express.json({ limit: '50mb' })); // Parse JSON data in request body
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoute);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve React build files

  // Serve the frontend index.html for all routes not covered by API
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
