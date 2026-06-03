import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBriefcase,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaSearch,
  FaStickyNote,
  FaCheck,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

// ── Status config ──────────────────────────────────────────
const STATUSES = [
  { value: "applied",     label: "Applied",     bg: "#dbeafe", color: "#1d4ed8" },
  { value: "screening",   label: "Screening",   bg: "#fef9c3", color: "#a16207" },
  { value: "shortlisted", label: "Shortlisted", bg: "#ede9fe", color: "#6d28d9" },
  { value: "interview",   label: "Interview",   bg: "#ffedd5", color: "#c2410c" },
  { value: "hired",       label: "Hired",       bg: "#dcfce7", color: "#15803d" },
  { value: "rejected",    label: "Rejected",    bg: "#fee2e2", color: "#b91c1c" },
];

const StatusBadge = ({ status }) => {
  const cfg = STATUSES.find((s) => s.value === status) || STATUSES[0];
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
};

// ── Note Modal ─────────────────────────────────────────────
function NoteModal({ application, onSave, onClose }) {
  const [note, setNote] = useState(application.recruiter_note || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(application._id, note);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl"
        style={{ background: "var(--card)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-semibold">Recruiter Note</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {application.candidate?.fullName || application.candidate?.name || "Candidate"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition"
            style={{ background: "var(--border)" }}
          >
            <FaTimes size={11} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add internal notes about this candidate..."
            className="w-full px-3 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition resize-none"
            style={{ borderColor: "var(--border)" }}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "var(--primary)" }}
            >
              <FaCheck size={11} />
              {saving ? "Saving..." : "Save Note"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80"
              style={{ borderColor: "var(--border)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Applicant Row ──────────────────────────────────────────
function ApplicantCard({ app, onStatusChange, onNoteClick }) {
  const candidate = app.candidate || {};
  const name = candidate.fullName || candidate.name || "Unknown Candidate";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4"
      style={{
        background: "var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      {/* Avatar + Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          {initials}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{name}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
            {candidate.email && (
              <span
                className="text-xs flex items-center gap-1 truncate"
                style={{ color: "var(--text-muted)" }}
              >
                <FaEnvelope size={10} />
                {candidate.email}
              </span>
            )}
            {candidate.phone && (
              <span
                className="text-xs flex items-center gap-1"
                style={{ color: "var(--text-muted)" }}
              >
                <FaPhone size={10} />
                {candidate.phone}
              </span>
            )}
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Applied{" "}
            {new Date(app.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Cover letter snippet */}
      {app.cover_letter && (
        <p
          className="text-xs hidden md:block max-w-xs line-clamp-2 italic"
          style={{ color: "var(--text-muted)" }}
        >
          "{app.cover_letter}"
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {/* Note button */}
        <button
          onClick={() => onNoteClick(app)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition hover:opacity-80"
          style={{
            borderColor: app.recruiter_note ? "var(--primary)" : "var(--border)",
            color: app.recruiter_note ? "var(--primary)" : "var(--text-muted)",
          }}
          title={app.recruiter_note ? "Edit note" : "Add note"}
        >
          <FaStickyNote size={10} />
          {app.recruiter_note ? "Note" : "Add Note"}
        </button>

        {/* Status dropdown */}
        <select
          value={app.status}
          onChange={(e) => onStatusChange(app._id, e.target.value)}
          className="px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition cursor-pointer"
          style={{
            borderColor: "var(--border)",
            background: "var(--card)",
            color: "var(--text)",
          }}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <StatusBadge status={app.status} />
      </div>
    </div>
  );
}

// ── Job Panel ──────────────────────────────────────────────
function JobPanel({ job, onStatusChange, onNoteClick, searchTerm, statusFilter }) {
  const [expanded, setExpanded] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchApplicants = async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/applications/job/${job._id}`, {
        withCredentials: true,
      });
      setApplications(res.data.applications || []);
      setFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!expanded) fetchApplicants();
    setExpanded((prev) => !prev);
  };

  const handleStatusChange = async (appId, newStatus) => {
    await onStatusChange(appId, newStatus);
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
    );
  };

  const handleNoteUpdated = (appId, note) => {
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, recruiter_note: note } : a))
    );
  };

  // filter applicants by search + status
  const filtered = applications.filter((app) => {
    const candidate = app.candidate || {};
    const name = (candidate.fullName || candidate.name || "").toLowerCase();
    const email = (candidate.email || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || name.includes(search) || email.includes(search);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // status count pills
  const counts = STATUSES.reduce((acc, s) => {
    const n = applications.filter((a) => a.status === s.value).length;
    if (n > 0) acc.push({ ...s, count: n });
    return acc;
  }, []);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Job header row — always visible */}
      <button
        onClick={handleToggle}
        className="w-full text-left p-5 flex items-center gap-4 transition hover:opacity-90"
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--border)" }}
        >
          <FaBriefcase size={15} />
        </div>

        {/* Job info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-base truncate">{job.title}</h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
              style={{
                background: job.status === "open" ? "#dcfce7" : "#fee2e2",
                color: job.status === "open" ? "#15803d" : "#b91c1c",
              }}
            >
              {job.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {job.location && (
              <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <FaMapMarkerAlt size={10} /> {job.location}
              </span>
            )}
            {job.employment_type && (
              <span className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                {job.employment_type}
              </span>
            )}
            {job.work_mode && (
              <span className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                · {job.work_mode}
              </span>
            )}
          </div>
        </div>

        {/* Applicant count + expand icon */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--primary)" }}>
            <FaUsers size={13} />
            {fetched ? applications.length : (job.applicationCount ?? 0)}
          </div>
          {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>
      </button>

      {/* Expanded applicants section */}
      {expanded && (
        <div
          className="border-t px-5 pb-5 pt-4 space-y-3"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Status summary pills */}
          {counts.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-1">
              {counts.map((c) => (
                <span
                  key={c.value}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: c.bg, color: c.color }}
                >
                  {c.label}: {c.count}
                </span>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <p className="text-sm py-4 text-center animate-pulse" style={{ color: "var(--text-muted)" }}>
              Loading applicants...
            </p>
          )}

          {/* No applicants */}
          {!loading && applications.length === 0 && (
            <div
              className="flex flex-col items-center py-8 rounded-xl border border-dashed"
              style={{ borderColor: "var(--border)" }}
            >
              <FaUsers size={24} style={{ color: "var(--text-muted)" }} />
              <p className="mt-2 text-sm font-medium">No applications yet</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Applicants will appear here once candidates apply
              </p>
            </div>
          )}

          {/* Filtered empty */}
          {!loading && applications.length > 0 && filtered.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
              No applicants match your current filters
            </p>
          )}

          {/* Applicant cards */}
          {!loading &&
            filtered.map((app) => (
              <ApplicantCard
                key={app._id}
                app={app}
                onStatusChange={handleStatusChange}
                onNoteClick={(a) => onNoteClick(a, handleNoteUpdated)}
              />
            ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function EmployerApplications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteTarget, setNoteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobSearch, setJobSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/jobs/employer/my-jobs`, {
          withCredentials: true,
        });
        setJobs(res.data.jobs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await axios.patch(
        `${API}/applications/${appId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleNoteSave = async (appId, note) => {
    try {
      await axios.post(
        `${API}/applications/${appId}/note`,
        { note },
        { withCredentials: true }
      );
      setNoteTarget(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    !jobSearch ||
    job.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
    job.location?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount ?? 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-base animate-pulse" style={{ color: "var(--text-muted)" }}>
          Loading your jobs...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Review and manage candidates across all your job postings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Jobs", value: jobs.length },
          { label: "Total Applicants", value: totalApps },
          { label: "Open Jobs", value: jobs.filter((j) => j.status === "open").length },
          { label: "Closed Jobs", value: jobs.filter((j) => j.status === "closed").length },
        ].map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-2xl border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="p-4 rounded-2xl border space-y-3"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Job search */}
          <div className="relative flex-1">
            <FaSearch
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Filter jobs by title or location..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          {/* Candidate search — filters inside expanded panels */}
          <div className="relative flex-1">
            <FaSearch
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search candidates by name or email..."
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
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {(jobSearch || searchTerm || statusFilter !== "all") && (
          <div className="flex justify-end">
            <button
              onClick={() => { setJobSearch(""); setSearchTerm(""); setStatusFilter("all"); }}
              className="text-xs flex items-center gap-1 transition hover:opacity-70"
              style={{ color: "var(--primary)" }}
            >
              <FaTimes size={10} /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {jobs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
          style={{ borderColor: "var(--border)" }}
        >
          <FaBriefcase size={32} style={{ color: "var(--text-muted)" }} />
          <p className="mt-3 font-medium">No jobs posted yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Post a job first to start receiving applications
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
          No jobs match your search
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <JobPanel
              key={job._id}
              job={job}
              onStatusChange={handleStatusChange}
              onNoteClick={setNoteTarget}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          ))}
        </div>
      )}

      {/* Note modal */}
      {noteTarget && (
        <NoteModal
          application={noteTarget}
          onSave={handleNoteSave}
          onClose={() => setNoteTarget(null)}
        />
      )}
    </div>
  );
}