import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    cover_letter: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      default: "direct",
    },

    status: {
      type: String,
      enum: [
        "applied",
        "screening",
        "shortlisted",
        "interview",
        "rejected",
        "hired",
      ],
      default: "applied",
    },

    recruiter_note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// One candidate can apply to a job only once
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);