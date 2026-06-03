import Application from "../models/Application.js";
import Job from "../models/Job.js";

// ─── CANDIDATE ────────────────────────────────────────────

// POST /api/applications/:jobId/apply
export const applyToJob = async (req, res) => {
  try {
    const { cover_letter } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    const existing = await Application.findOne({
      candidate: req.user.id,
      job: jobId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      candidate: req.user.id,
      job: jobId,
      cover_letter: cover_letter || "",
      source: "direct",
    });

    res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/applications/my-applications
// Candidate sees all their own applications with job + company info
export const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "companyName logo location",
        },
      })
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/applications/:id/withdraw
// Candidate withdraws their application (only if still "applied")
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (application.status !== "applied") {
      return res.status(400).json({
        success: false,
        message: "Cannot withdraw an application that is already in progress",
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application withdrawn",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── EMPLOYER ─────────────────────────────────────────────

// GET /api/applications/job/:jobId
// Employer sees all applicants for one of their jobs
export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("candidate", "fullName email phone")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/applications/:id/status
// Employer moves candidate through hiring stages
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const VALID_STATUSES = [
      "applied",
      "screening",
      "shortlisted",
      "interview",
      "rejected",
      "hired",
    ];

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/applications/:id/note
// Employer saves internal recruiter note on an application
export const addRecruiterNote = async (req, res) => {
  try {
    const { note } = req.body;

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    application.recruiter_note = note;
    await application.save();

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};