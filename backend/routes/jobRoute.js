import express from "express";
import {
  getJobs,
  getJobBySlug,
  getJobById,
  getEmployerJobs,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
} from "../controllers/jobController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/my-jobs", authMiddleware, getEmployerJobs);
router.post("/", authMiddleware, createJob);

router.get("/slug/:slug", getJobBySlug);
router.get("/:id", getJobById);
// Employer routes (protected)
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);
router.patch("/:id/status", authMiddleware, updateJobStatus);

export default router;