// backend/src/routes/upload.js
import express from "express";
import { uploadFile } from "../controllers/upload.js"; // your controller

const router = express.Router();

router.post("/", uploadFile); // POST /api/upload

export default router;
