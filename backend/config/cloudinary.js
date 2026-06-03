// ─────────────────────────────────────────────
//  Cloudinary — Config + Upload Helpers
//  Required .env variables:
//    CLOUDINARY_CLOUD_NAME=your_cloud_name
//    CLOUDINARY_API_KEY=your_api_key
//    CLOUDINARY_API_SECRET=your_api_secret
//
//  Used for: company logo, resume uploads
//  multer memoryStorage → buffer → Cloudinary stream
// ─────────────────────────────────────────────

import { v2 as cloudinary } from "cloudinary";

// ── Configure with env vars ───────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Upload buffer to Cloudinary ───────────────
//  @param buffer — file buffer from multer memoryStorage
//  @param folder — e.g. "jobportal/logos" or "jobportal/resumes"
//  @returns      — { secure_url, public_id, ... }
//
//  Example:
//    const result = await uploadToCloudinary(req.file.buffer, "jobportal/logos");
//    company.logo = result.secure_url;
//    company.logoPublicId = result.public_id;
export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(new Error("Cloudinary upload failed: " + error.message));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ── Delete asset from Cloudinary ─────────────
//  Call before uploading new logo/resume to avoid orphaned files
//  @param publicId — stored as logoPublicId or resumePublicId in DB
//
//  Example:
//    if (company.logoPublicId) await deleteFromCloudinary(company.logoPublicId);
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Non-critical — log but don't crash the request
    console.error("Cloudinary delete failed:", error.message);
  }
};

export default cloudinary;