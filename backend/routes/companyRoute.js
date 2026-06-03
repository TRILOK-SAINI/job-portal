// ─────────────────────────────────────────────
//  Employer Routes
//  Auth: authMiddleware (cookie-based jwt)
//  Blueprint ref: Employer Dashboard → API Blueprint
// ─────────────────────────────────────────────

import { Router }        from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadImage }   from "../middleware/upload.js";
import {
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo,
  getAnalytics,
} from "../controllers/companyController.js";

const router = Router();

// ── Company Profile ───────────────────────────────────────────────
// GET  /api/employer/company       → fetch company (owner = logged-in user)
// PUT  /api/employer/company       → upsert company profile
// POST /api/employer/company/logo  → multer → Cloudinary upload
router.get  ("/",      authMiddleware, getCompanyProfile);
router.put  ("/",      authMiddleware, updateCompanyProfile);
router.post ("/logo", authMiddleware, uploadImage, uploadCompanyLogo);

// ── Analytics ─────────────────────────────────────────────────────
// GET /api/employer/analytics → job counts + application pipeline
router.get("/analytics", authMiddleware, getAnalytics);

export default router;