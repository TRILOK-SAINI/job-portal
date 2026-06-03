// ─────────────────────────────────────────────
//  Middlewares: upload.js
//  Configures Multer for Memory Storage and handles parsing single files
// ─────────────────────────────────────────────

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Fallback insurance: ensure variables are parsed if the entry file execution order shifts
dotenv.config();

console.log("Cloudinary Check:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "EXISTS" : "MISSING",
});
import multer from "multer";

// 1. Configure storage engines to hold files as buffers in memory
const storage = multer.memoryStorage();

// 2. Optional: Add file type and size restrictions (Safety Guardrail)
const fileFilter = (req, file, cb) => {
  // Allow common image types
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit max size
  },
});

// 3. Define the explicit middleware called by the router
// 'logo' matches the key name your frontend sends inside FormData (e.g., formData.append('logo', file))
const uploadSingleImage = upload.single("logo");

export const uploadImage = (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading (e.g. file too large)
      return res.status(400).json({ message: `Upload configuration error: ${err.message}` });
    } else if (err) {
      // An unknown validation error occurred (e.g. wrong mime type)
      return res.status(400).json({ message: err.message });
    }
    
    // Everything went fine, move to controllers/employers.controller.js
    next();
  });
};