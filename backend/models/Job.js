import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    employment_type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },

    work_mode: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      default: "onsite",
    },

    salary_min: {
      type: Number,
      default: 0,
    },

    salary_max: {
      type: Number,
      default: 0,
    },

    experience_min: {
      type: Number,
      default: 0,
    },

    experience_max: {
      type: Number,
      default: 0,
    },

    openings: {
      type: Number,
      default: 1,
    },

    deadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.pre("save", async function () {
  // If slug doesn't exist, generate it
  if (!this.slug && this.title) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();
  }
  
  // No next() is needed when using async function hooks!
});

export default mongoose.model("Job", jobSchema);