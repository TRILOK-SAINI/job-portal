import mongoose from "mongoose";
import slugify from "slugify";

// ─────────────────────────────────────────────
//  Company Model
//  Blueprint ref: Database Blueprint → company_profiles table
//  Fields: name, slug, logo, logoPublicId, website, industry,
//          teamSize, founded, description, location{city,state,country},
//          socialLinks{linkedin,twitter,facebook},
//          verifiedBadge, verificationStatus, owner, status
// ─────────────────────────────────────────────

const companySchema = new mongoose.Schema(
  {
    // Basic identity
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    // Auto-generated from name — used in public company page URL
    slug: {
      type: String,
      unique: true,
    },

    // Cloudinary logo URL (populated after upload)
    logo: { type: String, default: "" },

    // Cloudinary public_id — needed to delete old logo on re-upload
    logoPublicId: { type: String, default: "" },

    website: { type: String, default: "" },

    industry: { type: String, default: "" },

    // Blueprint: teamSize enum
    teamSize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
      default: "1-10",
    },

    founded: { type: Number },

    description: {
      type: String,
      maxlength: [3000, "Description too long"],
      default: "",
    },

    // Structured location — city/state/country separate fields
    location: {
      city:    { type: String, default: "" },
      state:   { type: String, default: "" },
      country: { type: String, default: "" },
    },

    // Social links
    socialLinks: {
      linkedin: { type: String, default: "" },
      twitter:  { type: String, default: "" },
      facebook: { type: String, default: "" },
    },

    // Admin sets this after document verification
    verifiedBadge: { type: Boolean, default: false },

    // Admin moderation flow: pending → verified | rejected
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    // Employer who owns this company profile
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name on create/update
companySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Company = mongoose.model("Company", companySchema);
export default Company;