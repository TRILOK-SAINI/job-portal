import express from "express";
import {
  register,
  login,
  me,
} from "../controllers/authController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me",authMiddleware,me);
router.post("/logout", (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: isProduction ? "none" : "lax",
  });
  res.json({ message: "Logged out successfully" });
} );

export default router;