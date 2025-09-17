import express from "express";
import multer from "multer";
import fs from "fs";
import supabase from "../supabase.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const BUCKET = process.env.SUPABASE_BUCKET || "uploads";

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
      const uploadedFiles = {};

      // --- Validate required fields ---
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

      // --- Upload Image ---
      const imageFile = files.image[0];
      const imageBuffer = fs.readFileSync(imageFile.path);
      const imagePath = `images/${Date.now()}_${imageFile.originalname}`;

      const { error: imgErr } = await supabase.storage
        .from(BUCKET)
        .upload(imagePath, imageBuffer, {
          contentType: imageFile.mimetype,
        });

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
          });

        if (audErr) throw audErr;

        uploadedFiles.audio_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${audioPath}`;
      }

      // --- Save record in DB ---
      const { data, error: dbErr } = await supabase
        .from("messages")
        .insert([
          {
            image_url: uploadedFiles.image_url,
            text: text || null,
            audio_url: uploadedFiles.audio_url || null,
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
      return res
        .status(500)
        .json({ status: "error", message: err.message });
    }
  }
);

export default router;
