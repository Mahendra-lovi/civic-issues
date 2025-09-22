// backend/src/routes/upload.js
import express from "express";
import multer from "multer"; // ADD THIS
import { uploadFile, getUserFromToken } from "../controllers/upload.js";

const router = express.Router();

// 🚨 ADD MULTER MIDDLEWARE
const upload = multer({ dest: 'uploads/' });

// 🚨 ADD AUTH MIDDLEWARE AND MULTER
router.post("/", 
  getUserFromToken, // Auth middleware
  upload.fields([   // Multer middleware for file uploads
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]), 
  uploadFile       // Your controller
);

export default router;
