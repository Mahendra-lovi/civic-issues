// backend/src/controllers/upload.js
import fs from "fs";
import supabase from "../supabase.js";

const BUCKET = process.env.SUPABASE_BUCKET || "uploads";
const ALLOWED_CATEGORIES = ["garbage", "normal road", "potholes", "street light off", "street light on"];

// Middleware for user from token
export async function getUserFromToken(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token provided" });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: "Invalid or expired token" });

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Upload handler
export async function uploadFile(req, res) {
  try {
    const files = req.files;
    const text = req.body.text?.trim();
    const category = req.body.category?.trim();
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    const address = req.body.address?.trim() || null;

    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        status: "error",
        message: `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`,
      });
    }

    // 🚨 Reject "normal road" and "street light on"
    if (category === "normal road" || category === "street light on") {
      return res
        .status(400)
        .json({ status: "error", message: "No problem found" });
    }

    if (!files?.image) {
      return res
        .status(400)
        .json({ status: "error", message: "Image is required." });
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

    // --- Auto assign department based on category ---
    let department = "General";
    if (["garbage", "potholes"].includes(category)) {
      department = "Municipality";
    } else if (["street light off"].includes(category)) {
      department = "Electrical";
    }

    const uploadedFiles = {};

    // --- Upload Image ---
    const imageFile = files.image[0];
    const imageBuffer = fs.readFileSync(imageFile.path);
    const imagePath = `images/${Date.now()}_${imageFile.originalname}`;

    const { error: imgErr } = await supabase.storage
      .from(BUCKET)
      .upload(imagePath, imageBuffer, { contentType: imageFile.mimetype });

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
        .upload(audioPath, audioBuffer, { contentType: audioFile.mimetype });

      fs.unlinkSync(audioFile.path);
      if (audErr) throw audErr;

      uploadedFiles.audio_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${audioPath}`;
    }

    // --- Save record in DB with department ---
    const { data, error: dbErr } = await supabase
      .from("messages")
      .insert([
        {
          user_id: req.user.id,
          category,
          department, // ✅ added department
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
    return res.status(500).json({ status: "error", message: err.message });
  }
}


// Get messages for this user
export async function getMessages(req, res) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
}
