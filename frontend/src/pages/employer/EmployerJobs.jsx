import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaEye, FaBriefcase, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaUserTie } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

const EMPTY_FORM = {
  title: "",
  description: "",
  location: "",
  employment_type: "full-time",
  work_mode: "onsite",
  salary_min: "",
  salary_max: "",
  experience_min: "",
  experience_max: "",
  openings: 1,
  deadline: "",
  status: "open",
};

const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract", "internship"];
const WORK_MODES = ["onsite", "remote", "hybrid"];

const Badge = ({ value, type = "status" }) => {
  const statusColors = {
    open: { bg: "#dcfce7", color: "#15803d" },
    closed: { bg: "#fee2e2", color: "#b91c1c" },
  };
  const typeColors = {
    "full-time": { bg: "#dbeafe", color: "#1d4ed8" },
    "part-time": { bg: "#ede9fe", color: "#6d28d9" },
    contract: { bg: "#fef9c3", color: "#a16207" },
    internship: { bg: "#ffedd5", color: "#c2410c" },
    onsite: { bg: "#f0fdf4", color: "#166534" },
    remote: { bg: "#ecfeff", color: "#0e7490" },
    hybrid: { bg: "#fdf4ff", color: "#86198f" },
  };
  const colors = type === "status" ? statusColors[value] : typeColors[value];
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize tracking-wide shadow-sm"
      style={{ background: colors?.bg, color: colors?.color }}
    >
      {value}
    </span>
  );
};

const FormField = ({ label, children, half, error }) => (
  <div className={half ? "flex flex-col gap-1" : "flex flex-col gap-1 col-span-2"}>
    <label className="text-sm font-medium transition-colors" style={{ color: error ? "#f87171" : "var(--text-muted)" }}>
      {label}
    </label>
    {children}
    {error && <span className="text-xs text-red-400 font-medium mt-0.5">{error}</span>}
  </div>
);

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border bg-slate-900/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 placeholder:text-slate-500";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/jobs/my-jobs`, {
        withCredentials: true,
      });
      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    setErrors({});
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setErrors({});
    setFormData({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      employment_type: job.employment_type || "full-time",
      work_mode: job.work_mode || "onsite",
      salary_min: job.salary_min || "",
      salary_max: job.salary_max || "",
      experience_min: job.experience_min || "",
      experience_max: job.experience_max || "",
      openings: job.openings || 1,
      deadline: job.deadline ? job.deadline.substring(0, 10) : "",
      status: job.status || "open",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.title.trim()) tempErrors.title = "Job title is required.";
    if (!formData.description.trim()) tempErrors.description = "Job description is required.";
    if (!formData.location.trim()) tempErrors.location = "Location field is required.";
    
    const minSalary = Number(formData.salary_min);
    const maxSalary = Number(formData.salary_max);
    if (minSalary && maxSalary && minSalary > maxSalary) {
      tempErrors.salary_max = "Maximum salary cannot be lower than minimum salary.";
    }

    const minExp = Number(formData.experience_min);
    const maxExp = Number(formData.experience_max);
    if (minExp && maxExp && minExp > maxExp) {
      tempErrors.experience_max = "Maximum experience cannot be lower than minimum experience.";
    }

    if (formData.openings < 1) tempErrors.openings = "Must provide at least 1 opening.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      if (editingJob) {
        await axios.put(`${API}/jobs/${editingJob._id}`, formData, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API}/jobs`, formData, { withCredentials: true });
      }
      setShowModal(false);
      fetchJobs();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (job) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    try {
      await axios.patch(
        `${API}/jobs/${job._id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    try {
      await axios.delete(`${API}/jobs/${id}`, { withCredentials: true });
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const stats = [
    { label: "Total Jobs", value: jobs.length },
    { label: "Open", value: jobs.filter((j) => j.status === "open").length },
    { label: "Closed", value: jobs.filter((j) => j.status === "closed").length },
    {
      label: "Total Openings",
      value: jobs.reduce((sum, j) => sum + (j.openings || 0), 0),
    },
  ];

  return (
    <div className="min-h-screen pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Jobs</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Create and manage your job postings
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition duration-200 hover:opacity-90 active:scale-95 self-start sm:self-auto shadow-lg shadow-blue-500/10"
          style={{ background: "var(--primary)" }}
        >
          <FaPlus size={12} />
          Post a Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-2xl border transition-all hover:scale-[1.01]"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </p>
            <p className="text-3xl font-bold mt-2 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="text-center py-20 text-sm font-medium animate-pulse" style={{ color: "var(--text-muted)" }}>
          Loading jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed transition"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="p-4 rounded-full bg-slate-800/40 mb-3">
            <FaBriefcase size={28} style={{ color: "var(--text-muted)" }} />
          </div>
          <p className="font-semibold text-base">No jobs posted yet</p>
          <p className="text-sm mt-1 text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
            Click "Post a Job" to set up your profile's first active application window.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-2xl border flex flex-col gap-5 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 relative group"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              {/* Top row */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-xl tracking-tight leading-snug group-hover:text-blue-400 transition duration-200 truncate">{job.title}</h2>
                  <div className="flex items-center gap-1.5 text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    <FaMapMarkerAlt size={12} className="text-slate-400" />
                    <span>{job.location || "Location not set"}</span>
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-700/50 shadow-inner"
                  style={{ background: "var(--border)" }}
                >
                  <FaBriefcase size={14} className="text-slate-300" />
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge value={job.status} type="status" />
                {job.employment_type && <Badge value={job.employment_type} type="type" />}
                {job.work_mode && <Badge value={job.work_mode} type="type" />}
              </div>

              {/* Details */}
              <div
                className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t pt-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <span className="text-xs font-medium tracking-wide block mb-0.5" style={{ color: "var(--text-muted)" }}>Salary Range</span>
                  <p className="font-semibold text-slate-200">
                    {job.salary_min && job.salary_max
                      ? `₹${Number(job.salary_min).toLocaleString()} – ₹${Number(job.salary_max).toLocaleString()}`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium tracking-wide block mb-0.5" style={{ color: "var(--text-muted)" }}>Experience Required</span>
                  <p className="font-semibold text-slate-200">
                    {job.experience_min != null && job.experience_max != null
                      ? `${job.experience_min}–${job.experience_max} yrs`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium tracking-wide block mb-0.5" style={{ color: "var(--text-muted)" }}>Total Openings</span>
                  <p className="font-semibold text-slate-200">{job.openings || 1}</p>
                </div>
                <div>
                  <span className="text-xs font-medium tracking-wide block mb-0.5" style={{ color: "var(--text-muted)" }}>Application Deadline</span>
                  <p className="font-semibold text-slate-200">
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "No deadline"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t mt-auto" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={() => setViewingJob(job)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors duration-200 hover:bg-slate-800"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                  title="View full details"
                >
                  <FaEye size={13} /> View
                </button>
                <button
                  onClick={() => handleStatusToggle(job)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border transition-colors duration-200"
                  style={{
                    borderColor: "var(--border)",
                    color: job.status === "open" ? "#f87171" : "#4ade80",
                    backgroundColor: job.status === "open" ? "rgba(248,113,113,0.04)" : "rgba(74,222,128,0.04)"
                  }}
                >
                  {job.status === "open" ? "Close Job" : "Reopen"}
                </button>
                <button
                  onClick={() => openEditModal(job)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border transition-colors duration-200 hover:bg-slate-800 flex items-center justify-center gap-1.5"
                  style={{ borderColor: "var(--border)" }}
                >
                  <FaEdit size={11} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium border text-red-400 transition-colors duration-200 hover:bg-red-500/10"
                  style={{ borderColor: "var(--border)" }}
                >
                  <FaTrash size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Detail Modal Popup */}
      {viewingJob && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-800" style={{ background: "var(--card)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Badge value={viewingJob.status} type="status" />
                <h2 className="text-base font-bold tracking-tight">Job Spec Sheet</h2>
              </div>
              <button onClick={() => setViewingJob(null)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800 hover:bg-slate-700 transition">
                <FaTimes size={13} />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div>
                <h1 className="text-2xl font-extrabold text-white">{viewingJob.title}</h1>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1"><FaMapMarkerAlt size={12}/> {viewingJob.location || "Not specified"}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {viewingJob.employment_type && <Badge value={viewingJob.employment_type} type="type" />}
                {viewingJob.work_mode && <Badge value={viewingJob.work_mode} type="type" />}
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Salary Details</span>
                  <span className="text-sm font-semibold text-slate-200">
                    {viewingJob.salary_min && viewingJob.salary_max ? `₹${Number(viewingJob.salary_min).toLocaleString()} - ₹${Number(viewingJob.salary_max).toLocaleString()}` : "Not Disclosed"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Experience Scale</span>
                  <span className="text-sm font-semibold text-slate-200">
                    {viewingJob.experience_min != null ? `${viewingJob.experience_min}-${viewingJob.experience_max} Years` : "Open"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Openings Available</span>
                  <span className="text-sm font-semibold text-slate-200">{viewingJob.openings || 1} Positions</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Apply Deadline</span>
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <FaCalendarAlt size={11} className="text-blue-400" />
                    {viewingJob.deadline ? new Date(viewingJob.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Rolling Basis"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Job Description</h3>
                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/20 p-3 rounded-xl border border-slate-800/40">{viewingJob.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Input Modal (Create / Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div
            className="w-full max-w-2xl my-8 rounded-2xl shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-150"
            style={{ background: "var(--card)" }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="text-lg font-bold tracking-tight">
                {editingJob ? "Edit Posting Information" : "Post a New Job Opening"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition bg-slate-800/80 hover:bg-slate-700/80"
              >
                <FaTimes size={13} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4">

                {/* Title */}
                <FormField label="Job Title *" error={errors.title}>
                  <input
                    name="title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputCls}
                    style={{ borderColor: errors.title ? "#f87171" : "var(--border)" }}
                  />
                </FormField>

                {/* Location */}
                <FormField label="Location *" error={errors.location}>
                  <input
                    name="location"
                    placeholder="e.g. Mumbai, India"
                    value={formData.location}
                    onChange={handleChange}
                    className={inputCls}
                    style={{ borderColor: errors.location ? "#f87171" : "var(--border)" }}
                  />
                </FormField>

                {/* Employment Type */}
                <FormField label="Employment Type" half>
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                    className={inputCls}
                    style={{ borderColor: "var(--border)" }}
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-white">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Work Mode */}
                <FormField label="Work Mode" half>
                  <select
                    name="work_mode"
                    value={formData.work_mode}
                    onChange={handleChange}
                    className={inputCls}
                    style={{ borderColor: "var(--border)" }}
                  >
                    {WORK_MODES.map((m) => (
                      <option key={m} value={m} className="bg-slate-900 text-white">
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Salary Min */}
                <FormField label="Minimum Salary (₹)" half>
                  <input
                    type="number"
                    name="salary_min"
                    placeholder="e.g. 500000"
                    value={formData.salary_min}
                    onChange={handleChange}
                    min={0}
                    className={inputCls}
                    style={{ borderColor: "var(--border)" }}
                  />
                </FormField>

                {/* Salary Max */}
                <FormField label="Maximum Salary (₹)" half error={errors.salary_max}>
                  <input
                    type="number"
                    name="salary_max"
                    placeholder="e.g. 1200000"
                    value={formData.salary_max}
                    onChange={handleChange}
                    min={0}
                    className={inputCls}
                    style={{ borderColor: errors.salary_max ? "#f87171" : "var(--border)" }}
                  />
                </FormField>

                {/* Experience Min */}
                <FormField label="Min Experience (years)" half>
                  <input
                    type="number"
                    name="experience_min"
                    placeholder="e.g. 1"
                    value={formData.experience_min}
                    onChange={handleChange}
                    min={0}
                    className={inputCls}
                    style={{ borderColor: "var(--border)" }}
                  />
                </FormField>

                {/* Experience Max */}
                <FormField label="Max Experience (years)" half error={errors.experience_max}>
                  <input
                    type="number"
                    name="experience_max"
                    placeholder="e.g. 5"
                    value={formData.experience_max}
                    onChange={handleChange}
                    min={0}
                    className={inputCls}
                    style={{ borderColor: errors.experience_max ? "#f87171" : "var(--border)" }}
                  />
                </FormField>

                {/* Openings */}
                <FormField label="Number of Openings" half error={errors.openings}>
                  <input
                    type="number"
                    name="openings"
                    placeholder="e.g. 3"
                    value={formData.openings}
                    onChange={handleChange}
                    min={1}
                    className={inputCls}
                    style={{ borderColor: errors.openings ? "#f87171" : "var(--border)" }}
                  />
                </FormField>

                {/* Deadline */}
                <FormField label="Application Deadline" half>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={inputCls}
                    style={{ borderColor: "var(--border)" }}
                  />
                </FormField>

                {/* Status Layout Row (if updating fields) */}
                {editingJob && (
                  <FormField label="Posting Status Change" half>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={inputCls}
                      style={{ borderColor: "var(--border)" }}
                    >
                      <option value="open" className="bg-slate-900 text-white">Open</option>
                      <option value="closed" className="bg-slate-900 text-white">Closed</option>
                    </select>
                  </FormField>
                )}

                {/* Description */}
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-medium" style={{ color: errors.description ? "#f87171" : "var(--text-muted)" }}>
                    Job Description *
                  </label>
                  <textarea
                    rows={4}
                    name="description"
                    placeholder="Describe core duties, tool requirements, and company benefits structure..."
                    value={formData.description}
                    onChange={handleChange}
                    className={inputCls}
                    style={{ borderColor: errors.description ? "#f87171" : "var(--border)", resize: "vertical" }}
                  />
                  {errors.description && <span className="text-xs text-red-400 font-medium mt-0.5">{errors.description}</span>}
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex gap-3 mt-6 pt-5 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition active:scale-95 duration-150 shadow-md disabled:opacity-60"
                  style={{ background: "var(--primary)" }}
                >
                  {submitting ? "Saving changes..." : editingJob ? "Update Details" : "Publish Posting"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition hover:bg-slate-800 duration-200"
                  style={{ borderColor: "var(--border)" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}