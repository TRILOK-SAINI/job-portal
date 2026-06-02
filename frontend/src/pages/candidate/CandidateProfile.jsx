import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function CandidateProfile() {
  const API = import.meta.env.VITE_API_URL;
  const { user } = useAuth(); // Grabs the logged-in user details (like name) from global context

  // State Management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form Fields matched explicitly to your Mongoose Schema keys
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    skills: "", // Kept as string in state for natural comma-separated input typing
    experience: 0,
    bio: "",
    resume: "",
  });

  // 1. FETCH PROFILE DATA ON MOUNT
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Axios GET request with explicit credentials flag for cookies
        const response = await axios.get(`${API}/candidate/profile`, {
          withCredentials: true,
        });

        if (response.data.success && response.data.profile) {
          const prof = response.data.profile;
          setFormData({
            phone: prof.phone || "",
            location: prof.location || "",
            // Transforms backend string array ['React', 'Node'] into 'React, Node'
            skills: Array.isArray(prof.skills) ? prof.skills.join(", ") : "",
            experience: prof.experience || 0,
            bio: prof.bio || "",
            resume: prof.resume || "",
          });
        }
      } catch (error) {
        console.error("Error retrieving profile framework:", error);
        showFeedback("error", error.response?.data?.message || "Failed to load profile parameters.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API]);

  // Temporary feedback notifier layout utility
  const showFeedback = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  // 2. INPUT CHANGE MUTATOR
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" ? Number(value) : value,
    }));
  };

  // 3. SUBMIT PACKAGED DATA TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Convert local string back into a clean array structure for your Mongoose schema
      const processedSkills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const payload = {
        ...formData,
        skills: processedSkills,
      };

      // Axios PUT request with credentials flag for cookie tracking
      const response = await axios.put(`${API}/candidate/profile`, payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        showFeedback("success", "Profile updated successfully!");
        setIsEditMode(false);
        
        if (response.data.profile) {
          const updatedProf = response.data.profile;
          setFormData({
            phone: updatedProf.phone || "",
            location: updatedProf.location || "",
            skills: Array.isArray(updatedProf.skills) ? updatedProf.skills.join(", ") : "",
            experience: updatedProf.experience || 0,
            bio: updatedProf.bio || "",
            resume: updatedProf.resume || "",
          });
        }
      }
    } catch (error) {
      console.error("Error processing profile save:", error);
      showFeedback("error", error.response?.data?.message || "Server rejected profile variations.");
    } finally {
      setSaving(false);
    }
  };

  // CLEAN LOADING INLINE WRAPPER (Doesn't force rigid view-height disruptions)
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 py-24">
        <div className="w-9 h-9 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}></div>
        <p className="mt-4 text-xs font-semibold tracking-wide" style={{ color: "var(--text-muted)" }}>Synchronizing profile records...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 font-sans transition-colors duration-150">
      
      {/* SECTION TOPHEADER DASHBOARD GRID */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
            Profile Settings
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Review your verified credentials, technical skill stacks, and resume files.
          </p>
        </div>
        
        {!isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-sm flex items-center gap-1.5"
            style={{ background: "var(--primary)" }}
          >
            <span>✏️</span> Edit Profile
          </button>
        )}
      </div>

      {/* FEEDBACK BANNER SYSTEM */}
      {message.text && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold mb-6 border transition-all ${
          message.type === "success" 
            ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" 
            : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
        }`}>
          {message.type === "success" ? "🎯" : "⚠️"} {message.text}
        </div>
      )}

      {/* COMPONENT SUMMARY CARD SURFACE */}
      <div 
        className="border rounded-2xl shadow-sm overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Dynamic header banner layer accentuation */}
        <div className="h-16 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 w-full" />

        <div className="p-5 md:p-8 -mt-8 relative">
          
          {/* User Letter Badge Graphic Avatar */}
          <div 
            className="w-14 h-14 border-4 rounded-xl flex items-center justify-center font-black text-xl shadow mb-4 bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700"
            style={{ borderColor: "var(--card)", color: "var(--primary)" }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "👤"}
          </div>

          <div className="mb-6">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>{user?.name || "Candidate Name"}</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{user?.email || "Email context unlinked"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Phone Connection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Phone Connection
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="+91 99999 99999"
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* Location Matrix */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Location Matrix
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="Jaipur, Rajasthan"
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* Experience Matrix Counter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Experience Metrics (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* Resume Anchor Document String Target Link */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Resume Portfolio URL Link
                </label>
                <input
                  type="url"
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="https://drive.google.com/..."
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* Core Skill Vector Chip Tag Processing Rows */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Technical Skill Vectors (Comma Separated)
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all bg-transparent focus:ring-1 focus:ring-blue-500"
                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                  />
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {formData.skills ? (
                      formData.skills.split(",").map((sk, index) => sk.trim() && (
                        <span 
                          key={index} 
                          className="text-xs font-medium px-2.5 py-1 rounded-lg border shadow-sm"
                          style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                        >
                          ⚡ {sk.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic" style={{ color: "var(--text-muted)" }}>No technical skill vectors declared.</span>
                    )}
                  </div>
                )}
              </div>

              {/* Bio block description text summary area */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Professional Profile Summary Bio
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="Tell companies about your engineering patterns..."
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500 leading-relaxed"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

            </div>

            {/* FORM FOOTER CONTROLS ROW */}
            {isEditMode && (
              <div className="mt-6 pt-5 border-t flex justify-end gap-2.5" style={{ borderColor: "var(--border)" }}>
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  disabled={saving}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "var(--primary)" }}
                >
                  {saving ? "Updating..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}