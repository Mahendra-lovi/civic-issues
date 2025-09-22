// backend/src/routes/upload.js
import express from "express";
import multer from "multer";
import { uploadFile, getMessages, getUserFromToken } from "../controllers/upload.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload route
router.post(
  "/upload",
  getUserFromToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadFile
);

// Get messages route
router.get("/messages", getUserFromToken, getMessages);

export default router;
