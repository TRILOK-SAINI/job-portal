import Job from "../models/Job.js";
import Company from "../models/Company.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("company", "companyName location logo")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public — single job by slug
export const getJobBySlug = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug }).populate("company");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public — single job by ID (used internally)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Employer — get only their jobs
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id })
      .populate("company", "companyName location logo")
      .sort("-createdAt");

    // attach live application count to each job
    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicationCount };
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithCount.length,
      jobs: jobsWithCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Employer — create job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      employment_type,
      work_mode,
      salary_min,
      salary_max,
      experience_min,
      experience_max,
      openings,
      deadline,
    } = req.body;

    const company = await Company.findOne({ owner: req.user.id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Please create a company profile first",
      });
    }

    const job = await Job.create({
      title,
      description,
      location,
      employment_type,
      work_mode,
      salary_min,
      salary_max,
      experience_min,
      experience_max,
      openings,
      deadline,
      company: company._id,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Employer — update job (full update)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Employer — toggle open/closed status only
export const updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    job.status = status;
    await job.save();

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Employer — delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

