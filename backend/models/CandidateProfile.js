import mongoose from "mongoose";

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

   experience: {
  type: Number,
  default: 0,
},

    bio: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);