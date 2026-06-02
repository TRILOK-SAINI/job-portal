import React from 'react';

function Home() {
  // Placeholder data for design - you will connect this to your database/API later
  const popularCategories = [
    { name: 'Technology & IT', jobsCount: '1,240', icon: '💻' },
    { name: 'Marketing & Sales', jobsCount: '850', icon: '📈' },
    { name: 'Finance & Accounting', jobsCount: '430', icon: '💵' },
    { name: 'Design & Creative', jobsCount: '620', icon: '🎨' },
    { name: 'Human Resources', jobsCount: '210', icon: '🤝' },
    { name: 'Customer Support', jobsCount: '540', icon: '🎧' },
  ];

  const featuredJobs = [
    { id: 1, title: 'Senior React Developer', company: 'TechNova Solutions', location: 'Remote / Mumbai', type: 'Full-time', salary: '$80k - $110k' },
    { id: 2, title: 'UI/UX Product Designer', company: 'CreativePulse Studio', location: 'Hybrid / Bangalore', type: 'Full-time', salary: '$60k - $85k' },
    { id: 3, title: 'Growth Marketing Manager', company: 'SaaSify Inc.', location: 'Remote (US/India)', type: 'Contract', salary: '$50/hr - $70/hr' },
    { id: 4, title: 'Data Analyst & Engineer', company: 'Quantum Analytics', location: 'On-site / Delhi NCR', type: 'Full-time', salary: '$70k - $95k' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Find Your Dream Job <br className="hidden md:inline" /> & Build Your Future
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Discover thousands of career opportunities from world-class companies, updated daily.
          </p>

          {/* Search Box Form Component */}
          <div className="bg-white p-3 rounded-xl shadow-xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto text-gray-700">
            <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 px-3 py-2">
              <span className="mr-2 text-xl">🔍</span>
              <input 
                type="text" 
                placeholder="Job title, keywords, or company..." 
                className="w-full focus:outline-none placeholder-gray-400 bg-transparent text-sm"
              />
            </div>
            <div className="flex-1 flex items-center px-3 py-2">
              <span className="mr-2 text-xl">📍</span>
              <input 
                type="text" 
                placeholder="City, state, or 'Remote'..." 
                className="w-full focus:outline-none placeholder-gray-400 bg-transparent text-sm"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md text-sm whitespace-nowrap">
              Search Jobs
            </button>
          </div>

          <div className="mt-6 text-sm text-blue-100">
            <span className="font-semibold text-white">Popular Keywords:</span> Remote, React, Project Manager, Data Scientist, Designer
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center md:text-left mb-10 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-gray-500 mt-2">Explore wide-ranging sectors to target your specific skill sets.</p>
          </div>
          <button className="text-blue-600 font-semibold hover:underline mt-4 md:mt-0 flex items-center text-sm">
            View All Categories →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCategories.map((category, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center space-x-4 group"
            >
              <div className="text-4xl p-3 bg-blue-50 rounded-lg group-hover:bg-blue-600 group-hover:scale-105 transition-all">
                {category.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.jobsCount} Open Positions</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED LATEST JOBS */}
      <section className="bg-white py-16 px-4 md:px-8 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Opportunities</h2>
            <p className="text-gray-500 mt-2">Hand-picked premium positions from industry-leading innovators.</p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {featuredJobs.map((job) => (
              <div 
                key={job.id} 
                className="p-5 md:p-6 border border-gray-200 rounded-xl hover:shadow-md hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">🏢 {job.company}</span>
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    job.type === 'Full-time' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {job.type}
                  </span>
                  <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow transition-colors text-sm">
              Explore All 5,000+ Jobs
            </button>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION (CTA) SECTION */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-indigo-900 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Are You An Employer?</h2>
            <p className="text-indigo-200 mb-8 text-base md:text-lg">
              Post your open roles directly onto our board, sort applications efficiently using our dashboard, and screen high-quality talent today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg text-sm shadow transition-all">
                Post a Job Instantly
              </button>
              <button className="bg-transparent border border-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg text-sm transition-all">
                Learn About Pricing
              </button>
            </div>
          </div>
          {/* Subtle background abstract shape styling */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-700/30 rounded-full blur-xl"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-700/30 rounded-full blur-xl"></div>
        </div>
      </section>

    </div>
  );
}

export default Home;