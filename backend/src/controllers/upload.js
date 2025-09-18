import express from "express";
import multer from "multer";
import fs from "fs";
import supabase from "../supabase.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const BUCKET = process.env.SUPABASE_BUCKET || "uploads";

// Allowed categories
const ALLOWED_CATEGORIES = ["road", "water", "garbage", "electricity", "other"];

router.post(
  "/upload",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files;
      const text = req.body.text?.trim();
      const category = req.body.category?.trim();
      const latitude = parseFloat(req.body.latitude);
      const longitude = parseFloat(req.body.longitude);
      const address = req.body.address?.trim() || null;

      const uploadedFiles = {};

      // --- Validate required fields ---
      if (!category || !ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({
          status: "error",
          message: `Category is required and must be one of: ${ALLOWED_CATEGORIES.join(", ")}`,
        });
      }

      if (!files?.image) {
        return res.status(400).json({
          status: "error",
          message: "Image is required.",
        });
      }

      if (!text && !files?.audio) {
        return res.status(400).json({
          status: "error",
          message: "Either text or audio must be provided.",
        });
      }

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          status: "error",
          message: "Latitude and longitude are required.",
        });
      }

      // --- Upload Image ---
      const imageFile = files.image[0];
      const imageBuffer = fs.readFileSync(imageFile.path);
      const imagePath = `images/${Date.now()}_${imageFile.originalname}`;

      const { error: imgErr } = await supabase.storage
        .from(BUCKET)
        .upload(imagePath, imageBuffer, {
          contentType: imageFile.mimetype,
          upsert: false,
        });

      // cleanup temp file
      fs.unlinkSync(imageFile.path);

      if (imgErr) throw imgErr;

      uploadedFiles.image_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${imagePath}`;

      // --- Upload Audio if provided ---
      if (files?.audio) {
        const audioFile = files.audio[0];
        const audioBuffer = fs.readFileSync(audioFile.path);
        const audioPath = `audio/${Date.now()}_${audioFile.originalname}`;

        const { error: audErr } = await supabase.storage
          .from(BUCKET)
          .upload(audioPath, audioBuffer, {
            contentType: audioFile.mimetype,
            upsert: false,
          });

        // cleanup temp file
        fs.unlinkSync(audioFile.path);

        if (audErr) throw audErr;

        uploadedFiles.audio_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${audioPath}`;
      }

      // --- Save record in DB ---
      const { data, error: dbErr } = await supabase
        .from("messages")
        .insert([
          {
            category,
            text: text || null,
            image_url: uploadedFiles.image_url,
            audio_url: uploadedFiles.audio_url || null,
            latitude,
            longitude,
            address,
          },
        ])
        .select();

      if (dbErr) throw dbErr;

      return res.json({
        status: "success",
        message: "Uploaded successfully",
        record: data[0],
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
);

// --- Get messages (consistent response) ---
router.get("/messages", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
