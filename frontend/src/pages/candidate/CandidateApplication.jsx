import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaTimes,
  FaBuilding,
  FaExternalLinkAlt,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

// ── Status config ──────────────────────────────────────────
const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    bg: "#dbeafe",
    color: "#1d4ed8",
    step: 0,
  },
  screening: {
    label: "Screening",
    bg: "#fef9c3",
    color: "#a16207",
    step: 1,
  },
  shortlisted: {
    label: "Shortlisted",
    bg: "#ede9fe",
    color: "#6d28d9",
    step: 2,
  },
  interview: {
    label: "Interview",
    bg: "#ffedd5",
    color: "#c2410c",
    step: 3,
  },
  hired: {
    label: "Hired 🎉",
    bg: "#dcfce7",
    color: "#15803d",
    step: 4,
  },
  rejected: {
    label: "Rejected",
    bg: "#fee2e2",
    color: "#b91c1c",
    step: -1,
  },
};

const PIPELINE = ["applied", "screening", "shortlisted", "interview", "hired"];

// ── Status Badge ───────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.applied;
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
};

// ── Type Badge ─────────────────────────────────────────────
const TypeBadge = ({ value }) => {
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
      className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
      style={{ background: style.bg, color: style.color }}
    >
      {value}
    </span>
  );
};

// ── Pipeline Progress Bar ──────────────────────────────────
const PipelineBar = ({ status }) => {
  if (status === "rejected") {
    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Application Status
          </p>
        </div>
        <div
          className="w-full h-1.5 rounded-full"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-1.5 rounded-full"
            style={{ width: "100%", background: "#ef4444" }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {PIPELINE.map((s) => (
            <span key={s} className="text-xs capitalize" style={{ color: "#ef444480" }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const currentStep = STATUS_CONFIG[status]?.step ?? 0;
  const totalSteps = PIPELINE.length - 1;
  const pct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mt-4">
      <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
        Hiring Progress
      </p>
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "var(--primary)",
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        {PIPELINE.map((s, i) => {
          const done = i <= currentStep;
          return (
            <span
              key={s}
              className="text-xs capitalize font-medium"
              style={{
                color: done ? "var(--primary)" : "var(--text-muted)",
              }}
            >
              {s}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ── Withdraw Confirm Dialog ────────────────────────────────
function WithdrawDialog({ application, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ background: "var(--card)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Withdraw Application</h3>
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
          <p className="font-semibold text-sm">{application.job?.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--primary)" }}>
            {application.job?.company?.companyName}
          </p>
        </div>

        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          Are you sure you want to withdraw this application? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "#dc2626" }}
          >
            {loading ? "Withdrawing..." : "Yes, Withdraw"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80"
            style={{ borderColor: "var(--border)" }}
          >
            Keep Application
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Job Details Popup ──────────────────────────────────────
function JobDetailsDialog({ application, onClose }) {
  const job = application.job;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        style={{ background: "var(--card)" }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between p-6 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg font-bold leading-snug">{job?.title || "Job Removed"}</h2>
            <p className="text-sm font-medium mt-0.5" style={{ color: "var(--primary)" }}>
              {job?.company?.companyName || "—"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={application.status} />
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition"
              style={{ background: "var(--border)" }}
            >
              <FaTimes size={11} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 space-y-5">

          {/* Type badges */}
          <div className="flex flex-wrap gap-2">
            {job?.employment_type && <TypeBadge value={job.employment_type} />}
            {job?.work_mode && <TypeBadge value={job.work_mode} />}
          </div>

          {/* Info grid */}
          <div
            className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 rounded-xl border text-sm"
            style={{ background: "var(--bg)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <FaMapMarkerAlt size={12} />
              <span>{job?.location || "Not specified"}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <FaMoneyBillWave size={12} />
              <span>
                {job?.salary_min && job?.salary_max
                  ? `₹${Number(job.salary_min).toLocaleString()} – ₹${Number(job.salary_max).toLocaleString()}`
                  : "Not disclosed"}
              </span>
            </div>
            <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <FaBriefcase size={12} />
              <span>
                {job?.experience_min != null && job?.experience_max != null
                  ? `${job.experience_min}–${job.experience_max} yrs exp`
                  : "Any experience"}
              </span>
            </div>
            <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <FaClock size={12} />
              <span>
                Applied{" "}
                {new Date(application.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {job?.company?.companyName && (
              <div className="flex items-center gap-2 col-span-2" style={{ color: "var(--text-muted)" }}>
                <FaBuilding size={12} />
                <span>{job.company.companyName}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {job?.description && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>
                Job Description
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text)" }}>
                {job.description}
              </p>
            </div>
          )}

          {/* Skills / Requirements */}
          {job?.skills?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>
                Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recruiter note */}
          {application.recruiter_note && (
            <div
              className="rounded-xl px-4 py-3 text-sm border-l-4"
              style={{
                background: "var(--bg)",
                borderLeftColor: "var(--primary)",
                color: "var(--text-muted)",
              }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                Recruiter Note
              </p>
              {application.recruiter_note}
            </div>
          )}

          {/* Pipeline bar */}
          <PipelineBar status={application.status} />
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80"
            style={{ borderColor: "var(--border)" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stats Card ─────────────────────────────────────────────
const StatCard = ({ label, value, bg, color }) => (
  <div
    className="p-4 rounded-2xl border"
    style={{ background: "var(--card)", borderColor: "var(--border)" }}
  >
    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
      {label}
    </p>
    <p className="text-3xl font-bold mt-1" style={{ color: color || "var(--text)" }}>
      {value}
    </p>
  </div>
);

// ── Main Component ─────────────────────────────────────────
export default function CandidateApplication() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/applications/my-applications`, {
        withCredentials: true,
      });
      setApplications(res.data.applications || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawTarget) return;
    setWithdrawing(true);
    try {
      await axios.delete(
        `${API}/applications/${withdrawTarget._id}/withdraw`,
        { withCredentials: true }
      );
      setWithdrawTarget(null);
      fetchApplications();
    } catch (error) {
      alert(error?.response?.data?.message || "Could not withdraw.");
    } finally {
      setWithdrawing(false);
    }
  };

  // ── Filtered list ──────────────────────────────────────
  const filtered = applications.filter((app) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      app.job?.title?.toLowerCase().includes(search) ||
      app.job?.company?.companyName?.toLowerCase().includes(search) ||
      app.job?.location?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ── Stats ──────────────────────────────────────────────
  const counts = Object.keys(STATUS_CONFIG).reduce((acc, key) => {
    acc[key] = applications.filter((a) => a.status === key).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-base animate-pulse" style={{ color: "var(--text-muted)" }}>
          Loading your applications...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Track and manage all your job applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total" value={applications.length} />
        <StatCard label="Applied" value={counts.applied} color="#1d4ed8" />
        <StatCard label="Screening" value={counts.screening} color="#a16207" />
        <StatCard label="Shortlisted" value={counts.shortlisted} color="#6d28d9" />
        <StatCard label="Interview" value={counts.interview} color="#c2410c" />
        <StatCard label="Hired" value={counts.hired} color="#15803d" />
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-2xl border space-y-3"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-44 px-3 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || statusFilter !== "all") && (
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {filtered.length} of {applications.length} applications
            </p>
            <button
              onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
              className="text-xs flex items-center gap-1 transition hover:opacity-70"
              style={{ color: "var(--primary)" }}
            >
              <FaTimes size={10} /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {applications.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
          style={{ borderColor: "var(--border)" }}
        >
          <FaBriefcase size={32} style={{ color: "var(--text-muted)" }} />
          <p className="mt-3 font-medium">No applications yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Start applying to jobs to track your progress here
          </p>
          <button
            onClick={() => navigate("/candidate/jobs")}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            Browse Jobs
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-medium">No results match your filters</p>
          <button
            onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
            className="mt-3 text-sm transition hover:opacity-70"
            style={{ color: "var(--primary)" }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((app) => {
            const job = app.job;
            const canWithdraw = app.status === "applied";

            return (
              <div
                key={app._id}
                className="p-5 rounded-2xl border flex flex-col gap-3"
                style={{
                  background: "var(--card)",
                  borderColor: app.status === "rejected"
                    ? "#fca5a5"
                    : app.status === "hired"
                    ? "#86efac"
                    : "var(--border)",
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base leading-snug truncate">
                      {job?.title || "Job Removed"}
                    </h2>
                    <p
                      className="text-sm font-medium mt-0.5"
                      style={{ color: "var(--primary)" }}
                    >
                      {job?.company?.companyName || "—"}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                {/* Type badges */}
                <div className="flex flex-wrap gap-2">
                  {job?.employment_type && <TypeBadge value={job.employment_type} />}
                  {job?.work_mode && <TypeBadge value={job.work_mode} />}
                </div>

                {/* Info grid */}
                <div
                  className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm border-t pt-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <FaMapMarkerAlt size={11} />
                    <span className="truncate">{job?.location || "Not specified"}</span>
                  </div>

                  <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <FaMoneyBillWave size={11} />
                    <span>
                      {job?.salary_min && job?.salary_max
                        ? `₹${Number(job.salary_min).toLocaleString()} – ₹${Number(job.salary_max).toLocaleString()}`
                        : "Not disclosed"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <FaBriefcase size={11} />
                    <span>
                      {job?.experience_min != null && job?.experience_max != null
                        ? `${job.experience_min}–${job.experience_max} yrs`
                        : "Any exp"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <FaClock size={11} />
                    <span>
                      Applied{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Recruiter note if exists */}
                {app.recruiter_note && (
                  <div
                    className="rounded-xl px-4 py-3 text-sm border-l-4"
                    style={{
                      background: "var(--bg)",
                      borderLeftColor: "var(--primary)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                      Recruiter Note
                    </p>
                    {app.recruiter_note}
                  </div>
                )}

                {/* Pipeline bar */}
                <PipelineBar status={app.status} />

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  {job && (
                    <button
                      onClick={() => setViewTarget(app)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80"
                      style={{ borderColor: "var(--border)" }}
                    >
                      View Job
                    </button>
                  )}

                  {canWithdraw && (
                    <button
                      onClick={() => setWithdrawTarget(app)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <FaTimesCircle size={12} />
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job details popup */}
      {viewTarget && (
        <JobDetailsDialog
          application={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}

      {/* Withdraw confirm dialog */}
      {withdrawTarget && (
        <WithdrawDialog
          application={withdrawTarget}
          onConfirm={handleWithdraw}
          onCancel={() => setWithdrawTarget(null)}
          loading={withdrawing}
        />
      )}
    </div>
  );
}