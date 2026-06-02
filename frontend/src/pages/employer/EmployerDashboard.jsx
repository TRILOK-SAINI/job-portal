import React from "react";

export default function EmployerDashboard() {
  // Pure Mock Data Structure for the visual UI/UX layout
  const stats = [
    { label: "Active Job Openings", value: "12", change: "+2 this week", icon: "💼" },
    { label: "Total Applications", value: "148", change: "+24 new today", icon: "👥" },
    { label: "Interviews Scheduled", value: "18", change: "4 happening today", icon: "📅" },
    { label: "Hired Candidates", value: "32", change: "Target met 88%", icon: "🎉" },
  ];

  const recentApplicants = [
    { id: 1, name: "Aman Sharma", role: "Full Stack Engineer", status: "Interviewing", date: "Today" },
    { id: 2, name: "Priya Patel", role: "UI/UX Designer", status: "New Applied", date: "Yesterday" },
    { id: 3, name: "Rohan Das", role: "Backend Developer", status: "Reviewed", date: "2 days ago" },
    { id: 4, name: "Sneha Reddy", role: "DevOps Architect", status: "Offered", date: "4 days ago" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-8 font-sans transition-colors duration-150">
      
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
          Employer Hub Workspace
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Monitor system traction, parse inbound job application streams, and analyze workspace stats.
        </p>
      </div>

      {/* STATS METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((item, idx) => (
          <div 
            key={idx}
            className="p-5 border rounded-2xl shadow-sm transition-transform hover:scale-[1.01]"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                {item.change}
              </span>
            </div>
            <h3 className="text-2xl font-black mt-1" style={{ color: "var(--text)" }}>{item.value}</h3>
            <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--text-muted)" }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* RECENT RECRUITMENT SPLIT GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table List Area */}
        <div 
          className="lg:col-span-2 border rounded-2xl shadow-sm overflow-hidden" 
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
              Recent Candidate Activity
            </h2>
            <button className="text-xs font-semibold hover:underline" style={{ color: "var(--primary)" }}>
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b text-[11px] font-bold uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Target Role</th>
                  <th className="p-4">Process Status</th>
                  <th className="p-4">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: "var(--border)" }}>
                {recentApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-slate-500/5 transition-colors">
                    <td className="p-4 font-semibold" style={{ color: "var(--text)" }}>{applicant.name}</td>
                    <td className="p-4 text-xs" style={{ color: "var(--text-muted)" }}>{applicant.role}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                        applicant.status === "Interviewing" ? "bg-amber-500/10 text-amber-500" :
                        applicant.status === "Offered" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {applicant.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs" style={{ color: "var(--text-muted)" }}>{applicant.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informative Side Card Panel */}
        <div 
          className="p-5 border rounded-2xl shadow-sm flex flex-col justify-between"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text)" }}>
              Recruitment Directives
            </h2>
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-dashed" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-bold" style={{ color: "var(--text)" }}>Complete Profile Record</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>Ensure your corporate metadata profiles are fully synchronized so applicants can verify your pipeline.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-dashed" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-bold" style={{ color: "var(--text)" }}>Sync Calendar API</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>Integrate real-time interview pipelines directly into your operational client dashboard framework.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-[10px] italic text-center" style={{ color: "var(--text-muted)" }}>
              System Engine Version 4.1.0 • Stable Build
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}