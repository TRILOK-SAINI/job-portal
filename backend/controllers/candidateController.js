import mongoose from "mongoose";
import CandidateProfile from "../models/CandidateProfile.js";
export const getProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      phone,
      location,
      skills,
      experience,
      bio,
      resume,
    } = req.body;

    const profile =
      await CandidateProfile.findOneAndUpdate(
        {
          user: req.user.id,
        },
        {
          phone,
          location,
          skills,
          experience,
          bio,
          resume,
        },
        {
          new: true,
          upsert: true,
        }
      );

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};