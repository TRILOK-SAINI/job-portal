import express from "express";

import {
  getCompany,
  upsertCompany,
  getAllCompanies
} from "../controllers/companyController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// get all comapnies  public route
router.get("/all",getAllCompanies);


router.get(
  "/",
  authMiddleware,
  getCompany
);

router.put(
  "/",
  authMiddleware,
  upsertCompany
);

export default router;