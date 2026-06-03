import express from "express";
import {
  applyToJob,
  getCandidateApplications,
  withdrawApplication,
  getJobApplicants,
  updateApplicationStatus,
  addRecruiterNote,
} from "../controllers/applicationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Candidate routes
router.post("/:jobId/apply", authMiddleware, applyToJob);
router.get("/my-applications", authMiddleware, getCandidateApplications);
router.delete("/:id/withdraw", authMiddleware, withdrawApplication);

// Employer routes
router.get("/job/:jobId", authMiddleware, getJobApplicants);
router.patch("/:id/status", authMiddleware, updateApplicationStatus);
router.post("/:id/note", authMiddleware, addRecruiterNote);

export default router;