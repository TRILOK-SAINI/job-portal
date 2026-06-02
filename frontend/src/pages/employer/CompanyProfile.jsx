import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function CompanyProfile() {
  const API = import.meta.env.VITE_API_URL;
  const { user } = useAuth(); // Access current corporate administrator account

  // Operational State Matrices
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Core fields matching your backend Schema
  const [formData, setFormData] = useState({
    companyName: "",
    logo: "",
    website: "",
    industry: "",
    location: "",
    description: "",
  });

  // 1. FETCH COMPANY PROFILE
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        // Note: Assumes your app routes map this directly via router mount paths: /api/company
        const response = await axios.get(`${API}/company`, {
          withCredentials: true,
        });

        if (response.data.success && response.data.company) {
          const comp = response.data.company;
          setFormData({
            companyName: comp.companyName || "",
            logo: comp.logo || "",
            website: comp.website || "",
            industry: comp.industry || "",
            location: comp.location || "",
            description: comp.description || "",
          });
        }
      } catch (error) {
        console.error("Error connecting with company databases:", error);
        // If profile doesn't exist yet, we don't break; we allow insertion
        if (error.response?.status !== 404) {
          showFeedback("error", "Error mapping data pipelines from system servers.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [API]);

  const showFeedback = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  // 2. INPUT WORKSPACE TRANSFORM MUTATOR
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. SUBMIT PACKAGED METADATA FOR UPSERT ACTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      return showFeedback("error", "Company Name validation token missing.");
    }

    try {
      setSaving(true);
      const response = await axios.put(`${API}/company`, formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        showFeedback("success", "Corporate profile successfully synchronized!");
        setIsEditMode(false);
        if (response.data.company) {
          const updated = response.data.company;
          setFormData({
            companyName: updated.companyName || "",
            logo: updated.logo || "",
            website: updated.website || "",
            industry: updated.industry || "",
            location: updated.location || "",
            description: updated.description || "",
          });
        }
      }
    } catch (error) {
      console.error("Failure submitting payload variation profiles:", error);
      showFeedback("error", error.response?.data?.message || "Server rejected operations updates.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 py-24">
        <div className="w-9 h-9 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}></div>
        <p className="mt-4 text-xs font-semibold tracking-wide" style={{ color: "var(--text-muted)" }}>Hydrating data structures...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 font-sans transition-colors duration-150">
      
      {/* SECTION CONTAINER TOP BAR */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
            Corporate Ecosystem Profile
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Update public identities, validation schemas, vector logos, and active operational coordinates.
          </p>
        </div>
        
        {!isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-sm flex items-center gap-1.5"
            style={{ background: "var(--primary)" }}
          >
            <span>🏢</span> Modify Profile Layout
          </button>
        )}
      </div>

      {/* ALERTS AND POPUP FEEDBACKS */}
      {message.text && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold mb-6 border transition-all ${
          message.type === "success" 
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" 
            : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
        }`}>
          {message.type === "success" ? "🛡️" : "⚠️"} {message.text}
        </div>
      )}

      {/* CORPORATE CONTAINER PANEL CARD */}
      <div 
        className="border rounded-2xl shadow-sm overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="h-16 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 w-full" />

        <div className="p-5 md:p-8 -mt-8 relative">
          
          {/* LOGO BOX AREA GRAPHIC */}
          <div 
            className="w-14 h-14 border-4 rounded-xl flex items-center justify-center font-black text-sm overflow-hidden shadow mb-4 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700"
            style={{ borderColor: "var(--card)" }}
          >
            {formData.logo ? (
              <img src={formData.logo} alt="Corporate Identity Logo" className="w-full h-full object-cover" />
            ) : (
              <span style={{ color: "var(--primary)" }}>CORP</span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>
              {formData.companyName || "Unregistered Enterprise"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Authorized Workspace Representative: <span className="font-semibold">{user?.name || "System Admin"}</span>
            </p>
          </div>

          {/* APPLICATION FORM INTERACTION DESIGNS */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Enterprise Name Entry */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Legal Company Title *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="Enterprise Tech Solutions"
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* Logo String target link URL pointer */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Logo Vector Asset URL Link
                </label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="https://example.com/logo.png"
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* Website Pointer Link Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Corporate Public Domain URL Link
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="https://enterprise.dev"
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* Domain Industry Target Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Industry Vertical
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="FinTech, EdTech, SaaS"
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* HQ Coordinates Location String Input */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Headquarters Location Coordinate Matrix
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="Mumbai, Maharashtra"
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* Corporate Summary Paragraph Textarea Area */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Corporate Enterprise Summary Mission Statement
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="State your operational team values, system infrastructures, and technical visions..."
                  className="w-full text-sm border p-2.5 rounded-xl focus:outline-none transition-all disabled:opacity-50 bg-transparent focus:ring-1 focus:ring-blue-500 leading-relaxed"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

            </div>

            {/* CONTROL ROW INJECTION ENGINE */}
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
                  {saving ? "Updating..." : "Synchronize System Data"}
                </button>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}