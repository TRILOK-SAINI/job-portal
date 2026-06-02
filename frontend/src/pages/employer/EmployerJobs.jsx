import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaBriefcase,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] =
    useState(false);

  const [editingJob, setEditingJob] =
    useState(null);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      location: "",
      salary: "",
      experience: "",
      status: "open",
    });

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${API}/jobs`,
        {
          withCredentials: true,
        }
      );

      setJobs(res.data.jobs || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);

    setFormData({
      title: "",
      description: "",
      location: "",
      salary: "",
      experience: "",
      status: "open",
    });

    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);

    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      status: job.status,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingJob) {
        await axios.put(
          `${API}/jobs/${editingJob._id}`,
          formData,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          `${API}/jobs`,
          formData,
          {
            withCredentials: true,
          }
        );
      }

      setShowModal(false);

      fetchJobs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this job?"
      )
    )
      return;

    try {
      await axios.delete(
        `${API}/jobs/${id}`,
        {
          withCredentials: true,
        }
      );

      fetchJobs();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Manage Jobs
          </h1>

          <p
            style={{
              color:
                "var(--text-muted)",
            }}
          >
            Create and manage your
            job postings
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-white"
          style={{
            background:
              "var(--primary)",
          }}
        >
          <FaPlus />
          Create Job
        </button>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-4">
        <div
          className="p-5 rounded-2xl border"
          style={{
            background:
              "var(--card)",
            borderColor:
              "var(--border)",
          }}
        >
          <h3>Total Jobs</h3>

          <p className="text-3xl font-bold mt-2">
            {jobs.length}
          </p>
        </div>

        <div
          className="p-5 rounded-2xl border"
          style={{
            background:
              "var(--card)",
            borderColor:
              "var(--border)",
          }}
        >
          <h3>Open Jobs</h3>

          <p className="text-3xl font-bold mt-2">
            {
              jobs.filter(
                (j) =>
                  j.status ===
                  "open"
              ).length
            }
          </p>
        </div>

        <div
          className="p-5 rounded-2xl border"
          style={{
            background:
              "var(--card)",
            borderColor:
              "var(--border)",
          }}
        >
          <h3>Closed Jobs</h3>

          <p className="text-3xl font-bold mt-2">
            {
              jobs.filter(
                (j) =>
                  j.status ===
                  "closed"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Jobs */}

      <div className="grid lg:grid-cols-2 gap-5">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="p-5 rounded-2xl border"
            style={{
              background:
                "var(--card)",
              borderColor:
                "var(--border)",
            }}
          >
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold text-xl">
                  {job.title}
                </h2>

                <p
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                >
                  {job.location}
                </p>
              </div>

              <FaBriefcase
                size={22}
              />
            </div>

            <div className="mt-4 space-y-2">
              <p>
                Salary: ₹
                {job.salary}
              </p>

              <p>
                Experience:{" "}
                {
                  job.experience
                }{" "}
                Years
              </p>

              <span
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  background:
                    job.status ===
                    "open"
                      ? "#16a34a20"
                      : "#dc262620",
                }}
              >
                {job.status}
              </span>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                className="flex-1 py-2 rounded-lg border"
                style={{
                  borderColor:
                    "var(--border)",
                }}
              >
                <FaEye className="mx-auto" />
              </button>

              <button
                onClick={() =>
                  openEditModal(job)
                }
                className="flex-1 py-2 rounded-lg border"
                style={{
                  borderColor:
                    "var(--border)",
                }}
              >
                <FaEdit className="mx-auto" />
              </button>

              <button
                onClick={() =>
                  handleDelete(
                    job._id
                  )
                }
                className="flex-1 py-2 rounded-lg border text-red-500"
                style={{
                  borderColor:
                    "var(--border)",
                }}
              >
                <FaTrash className="mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div
            className="w-full max-w-2xl p-6 rounded-2xl"
            style={{
              background:
                "var(--card)",
            }}
          >
            <h2 className="text-2xl font-bold mb-5">
              {editingJob
                ? "Edit Job"
                : "Create Job"}
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >
              <input
                name="title"
                placeholder="Job Title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                className="w-full p-3 rounded-lg border bg-transparent"
              />

              <textarea
                rows="4"
                name="description"
                placeholder="Description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                className="w-full p-3 rounded-lg border bg-transparent"
              />

              <input
                name="location"
                placeholder="Location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                className="w-full p-3 rounded-lg border bg-transparent"
              />

              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={
                  formData.salary
                }
                onChange={
                  handleChange
                }
                className="w-full p-3 rounded-lg border bg-transparent"
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience"
                value={
                  formData.experience
                }
                onChange={
                  handleChange
                }
                className="w-full p-3 rounded-lg border bg-transparent"
              />

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
                className="w-full p-3 rounded-lg border bg-transparent"
              >
                <option value="open">
                  Open
                </option>

                <option value="closed">
                  Closed
                </option>
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-white"
                  style={{
                    background:
                      "var(--primary)",
                  }}
                >
                  {editingJob
                    ? "Update Job"
                    : "Create Job"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                  className="flex-1 py-3 rounded-xl border"
                  style={{
                    borderColor:
                      "var(--border)",
                  }}
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