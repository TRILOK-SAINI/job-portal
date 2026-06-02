import mongoose from "mongoose";
import Company from "../models/Company.js";

export const upsertCompany = async (
  req,
  res
) => {
  try {
    const {
      companyName,
      logo,
      website,
      industry,
      description,
      location,
    } = req.body;

    const company =
      await Company.findOneAndUpdate(
        {
          owner: req.user.id,
        },
        {
          companyName,
          logo,
          website,
          industry,
          description,
          location,
        },
        {
          new: true,
          upsert: true,
        }
      );

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getCompany = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findOne({
        owner: req.user.id,
      });

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
   const companies = await Company.find().populate(
  "owner",
  "name email role"
);

    res.status(200).json({  
      success: true,
      companies,
    });
  }
    catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCompanyById = async (
  req,
  res
) => {
  try {
    const company = await Company.findById(
      req.params.id
    ).populate(
      "owner",
      "name email role"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};