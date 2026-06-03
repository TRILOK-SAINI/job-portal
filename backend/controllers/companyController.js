// ─────────────────────────────────────────────
//  Employer Controller — Company Profile
//  No service layer — all DB logic here
//  Auth: uses req.user.id (from jwt decoded cookie)
//  Blueprint ref: Employer Dashboard → Company Profile page
// ─────────────────────────────────────────────

import Company        from "../models/Company.js";
// import EmployerProfile from "./employers.model.js";
import Job            from "../models/Job.js";
import Application    from "../models/Application.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

// ── GET /api/employer/company ────────────────────────────────────
//  Fetch company linked to the logged-in employer
//  req.user.id comes from jwt.verify(token) in authMiddleware
export const getCompanyProfile = async (req, res) => {
  try {
    // Find company owned by this user
    const company = await Company.findOne({ owner: req.user.id });

    return res.status(200).json({
      success: true,
      company: company || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── PUT /api/employer/company ────────────────────────────────────
//  Create company on first call, update on subsequent calls (upsert)
//  Body: { name, website, industry, teamSize, founded,
//          description, location:{city,state,country},
//          socialLinks:{linkedin,twitter,facebook} }
export const updateCompanyProfile = async (req, res) => {
  try {
    const {
      name,
      website,
      industry,
      teamSize,
      founded,
      description,
      location,     // { city, state, country }
      socialLinks,  // { linkedin, twitter, facebook }
    } = req.body;

    // findOneAndUpdate with upsert:true — creates if not exists
    const company = await Company.findOneAndUpdate(
      { owner: req.user.id },
      {
        name,
        website,
        industry,
        teamSize,
        founded,
        description,
        location,
        socialLinks,
        owner: req.user.id,
      },
      {
        new: true,        // return updated document
        upsert: true,     // create if not found
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      company,
      message: "Company profile saved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── POST /api/employer/company/logo ──────────────────────────────
//  Upload logo via multer (memoryStorage buffer) → Cloudinary
//  Deletes old logo from Cloudinary first if one exists
//  NOTE: Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
//        CLOUDINARY_API_SECRET in .env to activate
export const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    console.log("Received file:", req.file.originalname, "size:", req.file.size);

    // Find existing company to check for old logo
    const existing = await Company.findOne({ owner: req.user.id });

    if (!existing) {
      return res.status(400).json({
        success: false,
        message: "Create a company profile before uploading a logo",
      });
    }
    console.log("Existing company:", existing);

    // Delete old logo from Cloudinary if it exists
    if (existing.logoPublicId) {
      await deleteFromCloudinary(existing.logoPublicId);
    }

    // Upload new logo to Cloudinary under jobportal/logos/ folder
    const result = await uploadToCloudinary(
      req.file.buffer,
      "jobportal/logos"
    );

    // Save new logo URL + publicId back to company doc
    const company = await Company.findOneAndUpdate(
      { owner: req.user.id },
      {
        logo:          result.secure_url,
        logoPublicId:  result.public_id,
      },
      { new: true }
    );
    console.log("Updated company with new logo:", company);

    return res.status(200).json({
      success: true,
      logo: company.logo,
      message: "Logo uploaded successfully",
    });
  } catch (error) {
    console.error("Error in uploadCompanyLogo:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── GET /api/employer/analytics ──────────────────────────────────
//  Job counts + application pipeline breakdown
//  Blueprint ref: Analytics module
export const getAnalytics = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user.id });

    // No company yet — return empty analytics
    if (!company) {
      return res.status(200).json({
        success: true,
        analytics: null,
      });
    }

    // Run all count queries in parallel
    const [totalJobs, activeJobs, closedJobs, totalApplications] =
      await Promise.all([
        Job.countDocuments({ company: company._id }),
        Job.countDocuments({ company: company._id, status: "active" }),
        Job.countDocuments({ company: company._id, status: "closed" }),
        Application.countDocuments({ company: company._id }),
      ]);

    // Applications grouped by status — for pipeline chart
    const byStatus = await Application.aggregate([
      { $match: { company: company._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        byStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};