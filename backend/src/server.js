import express from "express";
import dotenv from "dotenv";
import uploadRoute from "./controllers/upload.js";
dotenv.config();

const app = express();

// Routes
app.use("/api", uploadRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
