import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import authRoutes from "./routes/auth.js";
import avatarRoutes from "./routes/avatar.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();
app.use(cors({origin: "*"}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/avatar", avatarRoutes);
app.use("/api/upload", uploadRoutes); // 🚨 CHANGE THIS LINE

// JSON 404 handler (put AFTER all routes)
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// JSON error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
