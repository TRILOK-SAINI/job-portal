import Job from "../models/Job.js";
import Company from "../models/Company.js";



export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      salary,
      experience,
    } = req.body;

    console.log("Creating job with data:", {
      title,
      description,
        location,
        salary,
        experience,
    });
    const company = await Company.findOne({
      owner: req.user.id,
    });

    console.log("Company found:", company);
    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          "Please create company profile first",
      });
    }

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      experience,
      company: company._id,
      createdBy: req.user.id,
    });
    console.log("Job created:", job);

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate(
        "company",
        "companyName location logo"
      )
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getJobById = async (
  req,
  res
) => {
  try {
    const job = await Job.findById(
      req.params.id
    ).populate("company");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateJob = async (
  req,
  res
) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      job.createdBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedJob =
      await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteJob = async (
  req,
  res
) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      job.createdBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};