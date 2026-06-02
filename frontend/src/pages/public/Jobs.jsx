import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Jobs() {
  const API = import.meta.env.VITE_API_URL;
  
  // 1. STATE FOR JOBS DATA & LOADING
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/jobs`);
        const data = await response.json();
        
        if (data.success) {
          // Setting the 'jobs' array from your API response structure
          setJobs(data.jobs); 
        } else {
          setError("Failed to load jobs");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [API]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Explore Open Roles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing <span className="font-semibold text-blue-600">{jobs.length}</span> available jobs
          </p>
        </div>

        {/* MAIN RESPONSIVE CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ================= FILTER SIDEBAR (Left Column) ================= */}
          {/* Hidden on mobile screens, shown on desktop (lg and up) */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎛️</span> Filters
            </h2>
            
            <div className="space-y-6">
              {/* Job Type Filter Placeholder */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Job Type</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /> Full-time</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /> Remote</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /> Contract</label>
                </div>
              </div>

              {/* Salary Bracket Placeholder */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Experience Level</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="exp" className="text-blue-600 focus:ring-blue-500" /> Entry Level</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="exp" className="text-blue-600 focus:ring-blue-500" /> Mid-Senior</label>
                </div>
              </div>
            </div>
          </div>

          {/* ================= JOBS LISTING (Right Column) ================= */}
          <div className="col-span-1 lg:col-span-3 space-y-4">
            
            {/* 2. LOADING STATE */}
            {loading && (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse h-32 w-full" />
                ))}
              </div>
            )}

            {/* 3. ERROR STATE */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center text-sm font-medium">
                {error}
              </div>
            )}

            {/* 4. EMPTY DATA STATE */}
            {!loading && !error && jobs.length === 0 && (
              <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-500">No jobs posted at the moment. Check back later!</p>
              </div>
            )}

            {/* 5. DATA RENDERING LOOP */}
            {!loading && !error && jobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left content block: Image + texts */}
                <div className="flex items-start gap-4">
                  {/* Company Logo container */}
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center font-bold text-blue-600 border border-blue-100 flex-shrink-0 text-lg">
                    {/* Safe fallback if company or logo string doesn't exist */}
                    {job.company?.companyName?.charAt(0) || "💼"}
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                      {job.title}
                    </h2>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">
                      {job.company?.companyName || "Unknown Company"}
                    </p>
                    
                    {/* Meta information flex wraps naturally on narrow devices */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">📍 {job.location}</span>
                      <span className="flex items-center gap-1">💼 {job.experience} Yrs Exp</span>
                      <span className="flex items-center gap-1 font-medium text-green-600">
                        ₹{job.salary?.toLocaleString('en-IN')} / month
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right content block: Badge status + Action button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-4 sm:pt-0">
                  <span className="text-xs font-semibold uppercase tracking-wider bg-green-100 text-green-800 px-2.5 py-1 rounded-md">
                    {job.status}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-5 rounded-lg shadow-sm transition-colors w-full sm:w-auto">
                  <Link 
  to={`/jobs/${job._id}`} 
  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-5 rounded-lg shadow-sm transition-colors text-center w-full sm:w-auto block"
>
  View Details
</Link>
                  </button>
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Jobs;