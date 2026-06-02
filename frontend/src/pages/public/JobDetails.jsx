import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function JobDetails() {
  const { id } = useParams();
  const API = import.meta.env.VITE_API_URL;
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // State Management
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);
  
  // NEW STATE: Controls the visibility of the Auth Alert Modal
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/jobs/${id}`);
        const data = await response.json();

        if (data.success) {
          setJob(data.job || data.data);
        } else {
          setError("Job not found or has been removed.");
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, API]);

  // BUTTON INTERCEPTOR
  const handleApplyClick = () => {
    // 1. If user is NOT logged in, open the beautiful explanation modal
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // 2. If logged in, proceed directly to submission
    setApplied(true);
  };

  // REDIRECT EXECUTION
  const handleProceedToLogin = () => {
    setShowAuthModal(false);
    // Preserves the current page route to redirect them back after authenticating
    navigate("/login", { state: { from: location.pathname } });
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4 text-sm animate-pulse">Loading job specifications...</p>
      </div>
    );
  }

  // ERROR UI
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-2">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800">Application Error</h2>
        <p className="text-gray-500 text-sm mt-1 max-w-sm">{error || "Could not retrieve info."}</p>
        <Link to="/jobs" className="mt-6 text-sm bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          ← Return to Job Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 font-sans relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb Link */}
        <Link to="/jobs" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 mb-6 font-medium">
          ← Back to all positions
        </Link>

        {/* HEADER PANEL */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-2xl font-black text-blue-600 flex-shrink-0">
              {job.company?.companyName?.charAt(0) || "💼"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{job.title}</h1>
              <p className="text-base font-semibold text-gray-700 mt-1">{job.company?.companyName || "Nikhil Solutions"}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">📍 {job.location || "Jaipur"}</span>
                <span className="flex items-center gap-1">🗓️ Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto flex flex-row sm:flex-col gap-3">
            <button 
              onClick={handleApplyClick}
              disabled={applied || job.status !== 'open'}
              className={`flex-1 md:flex-none text-sm font-bold px-8 py-3 rounded-xl shadow-sm text-center transition-all ${
                applied 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                  : job.status !== 'open'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {applied ? '✓ Application Submitted' : job.status !== 'open' ? 'Position Closed' : 'Apply For Role'}
            </button>
          </div>
        </div>

        {/* SPLIT LAYOUT COLUMNS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Job Specifications & Overview</h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              {job.description || "No specific details provided."}
            </p>
          </div>

          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3 mb-4">Job Summary Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 text-xs">Offered Salary</span>
                <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs">
                  ₹{job.salary?.toLocaleString('en-IN')} / mo
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 text-xs">Experience Metric</span>
                <span className="font-semibold text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded-md">
                  {job.experience} Year(s) Minimum
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= BEAUTIFUL AUTHENTICATION GATE MODAL POPUP ================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Shadow overlay blur layer */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAuthModal(false)} // Closes modal if clicking outside card
          />

          {/* Modal Container Content Box */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl relative z-10 w-full max-w-md border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Cross Button Top Edge */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>

            {/* Graphic and Text Notice Area */}
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-blue-100 shadow-inner">
                🚀
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Create an Account or Log In
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                To submit your application tracking token to <span className="font-semibold text-gray-800">{job.company?.companyName || "Nikhil Solutions"}</span>, you need an activated job seeker profile. 
              </p>
            </div>

            {/* Quick Informational Highlights Matrix List */}
            <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4 text-left space-y-2.5">
              <div className="flex gap-2 text-xs text-gray-600 items-start">
                <span className="text-blue-500 font-bold">✓</span>
                <span>Track application statuses right inside a personalized candidate dashboard.</span>
              </div>
              <div className="flex gap-2 text-xs text-gray-600 items-start">
                <span className="text-blue-500 font-bold">✓</span>
                <span>Upload, update, and submit dynamic custom resumes safely to employers.</span>
              </div>
            </div>

            {/* Modal Action Controls Flex buttons */}
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={handleProceedToLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-transform active:scale-[0.98] shadow-md"
              >
                Sign In / Sign Up to Apply
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                Keep Browsing
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default JobDetails;