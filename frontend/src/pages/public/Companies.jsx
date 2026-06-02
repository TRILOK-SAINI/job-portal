import { useEffect, useState } from "react";

function Companies() {
  const API = import.meta.env.VITE_API_URL;

  // State Management
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        // Using your exact endpoint route configuration
        const response = await fetch(`${API}/company/all`);
        const data = await response.json();

        if (data.success) {
          setCompanies(data.companies);
        } else {
          setError("Failed to fetch companies list.");
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Unable to establish connection to the database.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [API]);

  // Frontend filtering logic based on company name or industry
  const filteredCompanies = companies.filter((company) => {
    const matchesName = company.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = company.industry?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesName || matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP INTRO HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight md:text-4xl">
            Discover Top Workplaces
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Explore verified organizations hiring elite professionals globally. Find the culture that suits your workflow.
          </p>

          {/* SEARCH COMPONENT BOX */}
          <div className="mt-6 bg-white border border-gray-200 p-2.5 rounded-xl shadow-sm flex items-center gap-2 max-w-md mx-auto">
            <span className="text-lg pl-2">🔍</span>
            <input
              type="text"
              placeholder="Search companies by name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* LOADING UI STATE */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-gray-200 rounded-2xl h-56 animate-pulse" />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center text-sm font-medium max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* NO RESULTS VIEW STATE */}
        {!loading && !error && filteredCompanies.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto">
            <p className="text-gray-400 text-2xl mb-2">🏢</p>
            <h3 className="font-bold text-gray-800 text-base">No Companies Match Your Search</h3>
            <p className="text-xs text-gray-500 mt-1">Try refining your keyword parameters or spelling metrics.</p>
          </div>
        )}

        {/* MAIN RESPONSIVE CARD GRID DISPLAY */}
        {!loading && !error && filteredCompanies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Company Heading Section */}
                  <div className="flex items-center gap-4">
                    {/* Dynamic Graphic Placeholder box matching schema keys */}
                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center font-bold text-indigo-600 text-lg flex-shrink-0">
                      {company.logo ? (
                        <img src={company.logo} alt="" className="object-contain w-full h-full rounded-xl" />
                      ) : (
                        company.companyName?.charAt(0) || "🏢"
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h2 className="font-bold text-gray-900 text-base truncate hover:text-blue-600 cursor-pointer">
                        {company.companyName}
                      </h2>
                      <span className="inline-block text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-0.5">
                        {company.industry || "General Industry"}
                      </span>
                    </div>
                  </div>

                  {/* Location tracking tag block */}
                  <div className="mt-3 text-xs text-gray-500 font-medium flex items-center gap-1">
                    <span>📍</span> {company.location || "Location unlisted"}
                  </div>

                  {/* Summary content description from schema parsing */}
                  <p className="mt-4 text-xs text-gray-600 line-clamp-3 leading-relaxed bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                    {company.description || "No public operational details provided by the recruiting organization."}
                  </p>
                </div>

                {/* Footer anchor card link controls */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  {company.website ? (
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Visit Website 🔗
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">No web profile links</span>
                  )}

                  <button className="bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                    View Jobs
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Companies;