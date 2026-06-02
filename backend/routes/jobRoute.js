import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* public */
router.get("/", getJobs);
router.get("/:id", getJobById);

/* employer */
router.post("/", authMiddleware, createJob);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

export default router;