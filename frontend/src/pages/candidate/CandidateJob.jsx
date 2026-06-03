import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaClock,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaCalendarAlt, // Added missing import
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

const EMPLOYMENT_TYPES = ["all", "full-time", "part-time", "contract", "internship"];
const WORK_MODES = ["all", "onsite", "remote", "hybrid"];

// ── Badge ──────────────────────────────────────────────────
const Badge = ({ value, type }) => {
  const map = {
    "full-time":  { bg: "#dbeafe", color: "#1d4ed8" },
    "part-time":  { bg: "#ede9fe", color: "#6d28d9" },
    contract:     { bg: "#fef9c3", color: "#a16207" },
    internship:   { bg: "#ffedd5", color: "#c2410c" },
    onsite:       { bg: "#dcfce7", color: "#15803d" },
    remote:       { bg: "#ecfeff", color: "#0e7490" },
    hybrid:       { bg: "#fdf4ff", color: "#86198f" },
  };
  const style = map[value] || { bg: "var(--border)", color: "var(--text-muted)" };
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap"
      style={{ background: style.bg, color: style.color }}
    >
      {value}
    </span>
  );
};

// ── Confirm Popup ──────────────────────────────────────────
function ConfirmDialog({ job, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ background: "var(--card)" }}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">Confirm Application</h3>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition"
            style={{ background: "var(--border)" }}
          >
            <FaTimes size={11} />
          </button>
        </div>

        <div
          className="rounded-xl p-4 mb-5 border"
          style={{ background: "var(--bg)", borderColor: "var(--border)" }}
        >
          <p className="font-semibold">{job.title}</p>
          <p className="text-sm mt-0.5" style={{ color: "var(--primary)" }}>
            {job.company?.companyName || "Company"}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.employment_type && <Badge value={job.employment_type} />}
            {job.work_mode && <Badge value={job.work_mode} />}
          </div>
        </div>

        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          You are about to apply for this position. Make sure your profile is up to date before submitting.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--primary)" }}
          >
            {loading ? "Submitting..." : "Confirm Apply"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function CandidateJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Added viewingJob state hook
  const [viewingJob, setViewingJob] = useState(null); 
  const [confirmJob, setConfirmJob] = useState(null);
  const [applyingId, setApplyingId] = useState(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [jobsRes, appsRes] = await Promise.all([
          axios.get(`${API}/jobs`, { withCredentials: true }),
          axios.get(`${API}/applications/my-applications`, { withCredentials: true }),
        ]);

        setJobs(jobsRes.data.jobs || []);

        const ids = (appsRes.data.applications || []).map((a) => a.job?._id);
        setAppliedJobIds(new Set(ids));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyClick = (job) => {
    setConfirmJob(job);
  };

  const handleConfirmApply = async () => {
    if (!confirmJob) return;
    setApplyingId(confirmJob._id);
    try {
      await axios.post(
        `${API}/applications/${confirmJob._id}/apply`,
        { cover_letter: "" },
        { withCredentials: true }
      );
      setAppliedJobIds((prev) => new Set([...prev, confirmJob._id]));
      setConfirmJob(null);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to apply.");
    } finally {
      setApplyingId(null);
    }
  };

  // ── Filtering ────────────────────────────────────────────
  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      job.title?.toLowerCase().includes(search) ||
      job.company?.companyName?.toLowerCase().includes(search) ||
      job.location?.toLowerCase().includes(search);

    const matchesType =
      typeFilter === "all" || job.employment_type === typeFilter;

    const matchesMode =
      modeFilter === "all" || job.work_mode === modeFilter;

    const matchesLocation =
      !locationFilter ||
      job.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesType && matchesMode && matchesLocation;
  });

  const activeFilterCount = [
    typeFilter !== "all",
    modeFilter !== "all",
    locationFilter !== "",
    searchTerm !== "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setModeFilter("all");
    setLocationFilter("");
  };

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-base animate-pulse" style={{ color: "var(--text-muted)" }}>
          Loading opportunities...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Browse Jobs</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {jobs.length} open positions available
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-2xl border space-y-3"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Search row */}
        <div className="relative">
          <FaSearch
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search by title, company or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
            style={{ borderColor: "var(--border)" }}
          />
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={inputCls}
            style={{ borderColor: "var(--border)" }}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className={inputCls}
            style={{ borderColor: "var(--border)" }}
          >
            {WORK_MODES.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All Modes" : m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by city..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className={inputCls}
            style={{ borderColor: "var(--border)" }}
          />
        </div>

        {/* Active filter count + clear */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {filteredJobs.length} of {jobs.length} jobs shown
            </p>
            <button
              onClick={clearFilters}
              className="text-xs flex items-center gap-1 transition hover:opacity-70"
              style={{ color: "var(--primary)" }}
            >
              <FaTimes size={10} /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {filteredJobs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
          style={{ borderColor: "var(--border)" }}
        >
          <FaBriefcase size={32} style={{ color: "var(--text-muted)" }} />
          <p className="mt-3 font-medium">No jobs match your filters</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Try adjusting or clearing your search criteria
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const hasApplied = appliedJobIds.has(job._id);
            const isExpired =
              job.deadline && new Date(job.deadline) < new Date();

            return (
              <div
                key={job._id}
                className="p-5 rounded-2xl border flex flex-col gap-4 transition hover:shadow-md"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Top: Company + Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg leading-snug">
                      {job.title}
                    </h2>
                    <p
                      className="text-sm font-medium mt-0.5"
                      style={{ color: "var(--primary)" }}
                    >
                      {job.company?.companyName || "Company"}
                    </p>
                  </div>

                  {/* Applied badge */}
                  {hasApplied && (
                    <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0" style={{ background: "#dcfce7", color: "#15803d" }}>
                      <FaCheckCircle size={10} /> Applied
                    </span>
                  )}
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-2">
                  {job.employment_type && <Badge value={job.employment_type} />}
                  {job.work_mode && <Badge value={job.work_mode} />}
                </div>

                {/* Info grid */}
                <div
                  className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  {/* Location */}
                  <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <FaMapMarkerAlt size={11} />
                    <span className="truncate">{job.location || "Not specified"}</span>
                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <FaMoneyBillWave size={11} />
                    <span>
                      {job.salary_min && job.salary_max
                        ? `₹${Number(job.salary_min).toLocaleString()} – ₹${Number(job.salary_max).toLocaleString()}`
                        : "Not disclosed"}
                    </span>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <FaBriefcase size={11} />
                    <span>
                      {job.experience_min != null && job.experience_max != null
                        ? `${job.experience_min}–${job.experience_max} yrs exp`
                        : "Any experience"}
                    </span>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-1.5" style={{ color: isExpired ? "#b91c1c" : "var(--text-muted)" }}>
                    <FaClock size={11} />
                    <span>
                      {job.deadline
                        ? isExpired
                          ? "Deadline passed"
                          : `Due ${new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                        : "No deadline"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p
                  className="text-sm line-clamp-2 leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {job.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-1">
                  <button
                    onClick={() => setViewingJob(job)} // Changed from route navigation to setting state modal
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80"
                    style={{ borderColor: "var(--border)" }}
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleApplyClick(job)}
                    disabled={hasApplied || isExpired}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: hasApplied
                        ? "var(--text-muted)"
                        : "var(--primary)",
                    }}
                  >
                    {hasApplied ? "✓ Applied" : isExpired ? "Closed" : "Apply Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmJob && (
        <ConfirmDialog
          job={confirmJob}
          onConfirm={handleConfirmApply}
          onCancel={() => setConfirmJob(null)}
          loading={applyingId === confirmJob._id}
        />
      )}
{/* View Detail Modal Popup with Apply Option */}
{viewingJob && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <Badge value={viewingJob.employment_type || "Job Specs"} />
          <h2 className="text-base font-bold tracking-tight text-slate-800">Job Spec Sheet</h2>
        </div>
        <button onClick={() => setViewingJob(null)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-200 hover:bg-slate-300 transition text-slate-700">
          <FaTimes size={13} />
        </button>
      </div>
      
      {/* Body Content */}
      <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto bg-white">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{viewingJob.title}</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
            <FaMapMarkerAlt size={12} className="text-slate-400"/> {viewingJob.location || "Not specified"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {viewingJob.employment_type && <Badge value={viewingJob.employment_type} />}
          {viewingJob.work_mode && <Badge value={viewingJob.work_mode} />}
        </div>

        {/* High Contrast Info Grid */}
        <div className="grid grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl shadow-inner">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Salary Details</span>
            <span className="text-sm font-bold text-white">
              {viewingJob.salary_min && viewingJob.salary_max ? `₹${Number(viewingJob.salary_min).toLocaleString()} - ₹${Number(viewingJob.salary_max).toLocaleString()}` : "Not Disclosed"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Experience Scale</span>
            <span className="text-sm font-bold text-white">
              {viewingJob.experience_min != null ? `${viewingJob.experience_min}-${viewingJob.experience_max} Years` : "Open"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Openings Available</span>
            <span className="text-sm font-bold text-white">{viewingJob.openings || 1} Positions</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Apply Deadline</span>
            <span className="text-sm font-bold text-blue-300 flex items-center gap-1.5 mt-0.5">
              <FaCalendarAlt size={11} />
              {viewingJob.deadline ? new Date(viewingJob.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Rolling Basis"}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Job Description</h3>
          <p className="text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed bg-slate-100 p-4 rounded-xl border border-slate-200">
            {viewingJob.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50">
        <button
          onClick={() => {
            setViewingJob(null);
            handleApplyClick(viewingJob);
          }}
          className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition hover:opacity-90 active:scale-95 duration-150 shadow-md disabled:opacity-40"
          style={{ background: "var(--primary)" }}
          disabled={appliedJobIds.has(viewingJob._id) || (viewingJob.deadline && new Date(viewingJob.deadline) < new Date())}
        >
          {appliedJobIds.has(viewingJob._id) 
            ? "✓ Already Applied" 
            : (viewingJob.deadline && new Date(viewingJob.deadline) < new Date()) 
              ? "Applications Closed" 
              : "Apply For This Position"}
        </button>
        <button
          onClick={() => setViewingJob(null)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 duration-200"
        >
          Back to Listings
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}