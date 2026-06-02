import React from 'react';

export default function CandidateDashboard() {
  // Static Mock Data for structural layout
  const metrics = [
    { title: "Total Applications", count: "12", icon: "📁", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { title: "Shortlisted", count: "3", icon: "🌟", color: "bg-green-50 text-green-600 border-green-100" },
    { title: "Interviews Scheduled", count: "1", icon: "📅", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { title: "Rejected", count: "2", icon: "❌", color: "bg-red-50 text-red-600 border-red-100" },
  ];

  const recentApplications = [
    { id: 1, position: "MERN Stack Developer", company: "Nikhil Solutions", date: "June 02, 2026", status: "Shortlisted" },
    { id: 2, position: "Frontend UI Engineer", company: "PixelCraft Studio", date: "May 28, 2026", status: "Applied" },
    { id: 3, position: "Junior React Developer", company: "TechNova Corp", date: "May 15, 2026", status: "Rejected" },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      
      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Welcome Back, Candidate! 🚀</h1>
        <p className="text-sm text-gray-500 mt-1">Here is a quick overview of your current job application pipelines.</p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.title}</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{item.count}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${item.color}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* LOWER CONTENT SPLIT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table Column */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span> Recent Activity Tracker
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/70">
                  <th className="py-3 px-4">Role / Organization</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4 text-right">Pipeline Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{app.position}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{app.company}</p>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">{app.date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        app.status === "Shortlisted" ? "bg-green-100 text-green-700" :
                        app.status === "Applied" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Tips Box Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <h3 className="font-bold text-lg mb-2 z-10 relative">Complete Your Profile! 📈</h3>
            <p className="text-xs text-indigo-200 leading-relaxed z-10 relative mb-4">
              Profiles containing complete technical skill tags are up to 4x more likely to attract hiring managers.
            </p>
            <button className="bg-white text-indigo-900 text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-50 transition-transform active:scale-95 shadow">
              Optimize Profile
            </button>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-700/40 rounded-full blur-xl"></div>
          </div>
        </div>

      </div>

    </div>
  );
}