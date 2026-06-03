import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Building2, Globe, MapPin, Users, Calendar, CheckCircle2,
  Clock, XCircle, Pencil, Upload, X, Save,
} from "lucide-react";

const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Facebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const API = import.meta.env.VITE_API_URL;

// ── Team size options — from blueprint schema ─────────────────────
const TEAM_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

// ── Empty form state ──────────────────────────────────────────────
const EMPTY_FORM = {
  name:        "",
  website:     "",
  industry:    "",
  teamSize:    "1-10",
  founded:     "",
  description: "",
  location:    { city: "", state: "", country: "" },
  socialLinks: { linkedin: "", twitter: "", facebook: "" },
};

// ── Verification badge ────────────────────────────────────────────
const BADGE = {
  verified: { label: "Verified",             icon: CheckCircle2, cls: "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50" },
  pending:  { label: "Pending Verification",  icon: Clock,        cls: "bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50" },
  rejected: { label: "Verification Rejected", icon: XCircle,      cls: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50" },
};

// ── Component Internal Core Styles (Maps directly to your index tokens) ──
const cardStyle = "p-6 rounded-xl border shadow-sm transition-all duration-200";
const labelStyle = "block text-sm font-medium mb-1.5";
const inputStyle = "w-full p-2.5 text-sm rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 bg-transparent";
const btnPrimary = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm";
const btnSecondary = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all hover:opacity-80 bg-transparent cursor-pointer";

function VerificationBadge({ status = "pending" }) {
  const cfg  = BADGE[status] || BADGE.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <Icon size={12} /> {cfg.label}
    </span>
  );
}

// ── Field error message ───────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1 font-medium">{msg}</p>;
}

export default function CompanyProfile() {
  const fileRef = useRef(null);

  const [company,     setCompany]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [isEditing,   setIsEditing]   = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [errors,      setErrors]      = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile,    setLogoFile]    = useState(null);

  // ── Fetch company on mount ────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/company`, {
          withCredentials: true,
        });
        const c = res.data.company;
        setCompany(c || null);
        if (c) populateForm(c);
      } catch (err) {
        toast.error("Failed to load company profile");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ── Populate form from company data ──────────────────────────
  const populateForm = (c) => {
    setForm({
      name:        c.name        || "",
      website:     c.website     || "",
      industry:    c.industry    || "",
      teamSize:    c.teamSize    || "1-10",
      founded:     c.founded     || "",
      description: c.description || "",
      location: {
        city:    c.location?.city    || "",
        state:   c.location?.state   || "",
        country: c.location?.country || "",
      },
      socialLinks: {
        linkedin: c.socialLinks?.linkedin || "",
        twitter:  c.socialLinks?.twitter  || "",
        facebook: c.socialLinks?.facebook || "",
      },
    });
  };

  // ── Form validation ───────────────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.name.trim())
      e.name = "Company name is required";

    if (form.website && !/^https?:\/\/.+/.test(form.website))
      e.website = "Enter a valid URL starting with http:// or https://";

    if (form.founded) {
      const yr = Number(form.founded);
      if (isNaN(yr) || yr < 1900 || yr > new Date().getFullYear())
        e.founded = `Enter a valid year between 1900 and ${new Date().getFullYear()}`;
    }

    if (form.socialLinks.linkedin && !/^https?:\/\/.+/.test(form.socialLinks.linkedin))
      e.linkedin = "Enter a valid LinkedIn URL";

    if (form.socialLinks.twitter && !/^https?:\/\/.+/.test(form.socialLinks.twitter))
      e.twitter = "Enter a valid Twitter URL";

    if (form.socialLinks.facebook && !/^https?:\/\/.+/.test(form.socialLinks.facebook))
      e.facebook = "Enter a valid Facebook URL";

    if (form.description.length > 3000)
      e.description = "Description cannot exceed 3000 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Save profile ──────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await axios.put(
        `${API}/company`,
        form,
        { withCredentials: true }
      );
      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile); 

        await axios.post(
          `${API}/company/logo`, 
          formData, 
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      setCompany(res.data.company);
      populateForm(res.data.company);
      setIsEditing(false);
      setErrors({});
      toast.success("Company profile saved successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // ── Cancel edit ───────────────────────────────────────────────
  const handleCancel = () => {
    if (company) populateForm(company);
    setIsEditing(false);
    setErrors({});
    setLogoPreview(null);
    setLogoFile(null);
  };

  // ── Logo file select ──────────────────────────────────────────
  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, or WebP allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // ── Logo upload to Cloudinary via server ──────────────────────
  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", logoFile);
      const res = await axios.post(
        `${API}/company/logo`,
        fd,
        { withCredentials: true }
      );
      setCompany((prev) => ({ ...prev, logo: res.data.logo }));
      setLogoPreview(null);
      setLogoFile(null);
      toast.success("Logo uploaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logo upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Field change handlers ─────────────────────────────────────
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const handleLocation = (e) => {
    setForm((f) => ({ ...f, location: { ...f.location, [e.target.name]: e.target.value } }));
  };

  const handleSocial = (e) => {
    setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [e.target.name]: e.target.value } }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  // ── Loading skeleton ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse px-4 py-8 max-w-6xl mx-auto">
        <div className="h-8 w-48 rounded-lg" style={{ background: "var(--border)" }} />
        <div className="p-6 h-40 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }} />
        <div className="p-6 h-64 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }} />
      </div>
    );
  }

  const logoSrc  = logoPreview || company?.logo || null;
  const initials = (company?.name || form.name || "CO").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 pb-24 px-4 py-8 max-w-6xl mx-auto">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Company Profile</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Manage your public company information
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => { populateForm(company || {}); setIsEditing(true); }}
            className={btnPrimary}
            style={{ backgroundColor: "var(--primary)" }}
          >
            <Pencil size={15} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className={btnSecondary} style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              <X size={15} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className={btnPrimary} style={{ backgroundColor: "var(--primary)" }}>
              <Save size={15} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* ── Logo + identity ───────────────────────────────────── */}
      <div className={cardStyle} style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex flex-col sm:flex-row items-start gap-6">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl border-2 overflow-hidden flex items-center justify-center shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
              {logoSrc
                ? <img src={logoSrc} alt="Logo" className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold" style={{ color: "var(--primary)" }}>{initials}</span>
              }
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleLogoSelect}
            />

            {!logoPreview ? (
              <button
                onClick={() => fileRef.current?.click()}
                className="text-xs flex items-center gap-1 font-medium hover:opacity-80"
                style={{ color: "var(--primary)" }}
              >
                <Upload size={12} /> Upload Logo
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleLogoUpload}
                  disabled={uploading}
                  className="text-xs text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-50"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {uploading ? "Uploading..." : "Confirm"}
                </button>
                <button
                  onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                  className="text-xs border px-3 py-1.5 rounded-lg hover:text-red-500 transition-colors"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  Remove
                </button>
              </div>
            )}
            <p className="text-[11px] text-center leading-tight" style={{ color: "var(--text-muted)" }}>
              JPG, PNG, WebP<br />Max 2MB
            </p>
          </div>

          {/* Name + badge */}
          <div className="flex-1 min-w-0 w-full">
            {isEditing ? (
              <div>
                <label className={labelStyle} style={{ color: "var(--text)" }}>
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Acme Technologies Pvt. Ltd."
                  className={inputStyle}
                  style={{ 
                    borderColor: errors.name ? "#f87171" : "var(--border)", 
                    color: "var(--text)" 
                  }}
                />
                <FieldError msg={errors.name} />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold truncate" style={{ color: "var(--text)" }}>
                  {company?.name || (
                    <span className="font-normal italic" style={{ color: "var(--text-muted)" }}>Company name not set</span>
                  )}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{company?.industry || "—"}</p>
              </div>
            )}

            <div className="mt-3">
              <VerificationBadge status={company?.verificationStatus} />
            </div>

            {!company && !isEditing && (
              <p className="mt-3 text-sm border rounded-lg px-3 py-2 bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400">
                No company profile yet. Click <strong>Edit Profile</strong> to get started.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Company details ───────────────────────────────────── */}
      <div className={cardStyle} style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text)" }}>
          <Building2 size={16} style={{ color: "var(--primary)" }} /> Company Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Website */}
          <div>
            <label className={labelStyle} style={{ color: "var(--text)" }}>
              <Globe size={13} className="inline mr-1 opacity-70" style={{ color: "var(--text-muted)" }} /> Website
            </label>
            {isEditing ? (
              <>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className={inputStyle}
                  style={{ 
                    borderColor: errors.website ? "#f87171" : "var(--border)", 
                    color: "var(--text)" 
                  }}
                />
                <FieldError msg={errors.website} />
              </>
            ) : (
              <p className="text-sm break-all">
                {company?.website
                  ? <a href={company.website} target="_blank" rel="noreferrer" className="underline hover:opacity-80" style={{ color: "var(--primary)" }}>{company.website}</a>
                  : <span style={{ color: "var(--text-muted)" }}>—</span>
                }
              </p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className={labelStyle} style={{ color: "var(--text)" }}>
              <Building2 size={13} className="inline mr-1 opacity-70" style={{ color: "var(--text-muted)" }} /> Industry
            </label>
            {isEditing ? (
              <input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="e.g. FinTech, SaaS, EdTech"
                className={inputStyle}
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              />
            ) : (
              <p className="text-sm" style={{ color: "var(--text)" }}>{company?.industry || <span style={{ color: "var(--text-muted)" }}>—</span>}</p>
            )}
          </div>

          {/* Team size */}
          <div>
            <label className={labelStyle} style={{ color: "var(--text)" }}>
              <Users size={13} className="inline mr-1 opacity-70" style={{ color: "var(--text-muted)" }} /> Team Size
            </label>
            {isEditing ? (
              <select 
                name="teamSize" 
                value={form.teamSize} 
                onChange={handleChange} 
                className={inputStyle}
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                {TEAM_SIZES.map((s) => (
                  <option key={s} value={s} style={{ background: "var(--card)", color: "var(--text)" }}>{s} employees</option>
                ))}
              </select>
            ) : (
              <p className="text-sm" style={{ color: "var(--text)" }}>
                {company?.teamSize ? `${company.teamSize} employees` : <span style={{ color: "var(--text-muted)" }}>—</span>}
              </p>
            )}
          </div>

          {/* Founded */}
          <div>
            <label className={labelStyle} style={{ color: "var(--text)" }}>
              <Calendar size={13} className="inline mr-1 opacity-70" style={{ color: "var(--text-muted)" }} /> Founded Year
            </label>
            {isEditing ? (
              <>
                <input
                  type="number"
                  name="founded"
                  value={form.founded}
                  onChange={handleChange}
                  placeholder="e.g. 2018"
                  min="1900"
                  max={new Date().getFullYear()}
                  className={inputStyle}
                  style={{ 
                    borderColor: errors.founded ? "#f87171" : "var(--border)", 
                    color: "var(--text)" 
                  }}
                />
                <FieldError msg={errors.founded} />
              </>
            ) : (
              <p className="text-sm" style={{ color: "var(--text)" }}>
                {company?.founded || <span style={{ color: "var(--text-muted)" }}>—</span>}
              </p>
            )}
          </div>

          {/* Description — full width */}
          <div className="md:col-span-2">
            <label className={labelStyle} style={{ color: "var(--text)" }}>Company Description</label>
            {isEditing ? (
              <>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your company, culture, mission..."
                  className={`${inputStyle} resize-none`}
                  style={{ 
                    borderColor: errors.description ? "#f87171" : "var(--border)", 
                    color: "var(--text)" 
                  }}
                />
                <div className="flex justify-between mt-1">
                  <FieldError msg={errors.description} />
                  <span className={`text-xs ml-auto ${form.description.length > 2800 ? "text-red-400" : ""}`} style={{ color: "var(--text-muted)" }}>
                    {form.description.length}/3000
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text)" }}>
                {company?.description || <span className="italic" style={{ color: "var(--text-muted)" }}>No description added yet.</span>}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Location ──────────────────────────────────────────── */}
      <div className={cardStyle} style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text)" }}>
          <MapPin size={16} style={{ color: "var(--primary)" }} /> Location
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "city",    label: "City"             },
            { key: "state",   label: "State / Province" },
            { key: "country", label: "Country"          },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={labelStyle} style={{ color: "var(--text)" }}>{label}</label>
              {isEditing ? (
                <input
                  name={key}
                  value={form.location[key]}
                  onChange={handleLocation}
                  placeholder={label}
                  className={inputStyle}
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              ) : (
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  {company?.location?.[key] || <span style={{ color: "var(--text-muted)" }}>—</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Social links ──────────────────────────────────────── */}
      <div className={cardStyle} style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text)" }}>
          Social Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/company/..." },
            { key: "twitter",  label: "Twitter",  icon: Twitter,  placeholder: "https://twitter.com/..."          },
            { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/..."         },
          ].map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className={labelStyle} style={{ color: "var(--text)" }}>
                <Icon size={13} className="inline mr-1 opacity-70" style={{ color: "var(--text-muted)" }} /> {label}
              </label>
              {isEditing ? (
                <>
                  <input
                    name={key}
                    value={form.socialLinks[key]}
                    onChange={handleSocial}
                    placeholder={placeholder}
                    className={inputStyle}
                    style={{ 
                      borderColor: errors[key] ? "#f87171" : "var(--border)", 
                      color: "var(--text)" 
                    }}
                  />
                  <FieldError msg={errors[key]} />
                </>
              ) : (
                <p className="text-sm break-all">
                  {company?.socialLinks?.[key]
                    ? <a href={company.socialLinks[key]} target="_blank" rel="noreferrer" className="underline hover:opacity-80" style={{ color: "var(--primary)" }}>{company.socialLinks[key]}</a>
                    : <span style={{ color: "var(--text-muted)" }}>—</span>
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky bottom save bar — edit mode only ───────────── */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t px-6 py-4 flex justify-end gap-3 shadow-lg" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <button onClick={handleCancel} className={btnSecondary} style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            <X size={15} /> Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className={btnPrimary} style={{ backgroundColor: "var(--primary)" }}>
            <Save size={15} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

    </div>
  );
}