import React from 'react';

export default function PublicFooter() {
  return (
    <footer
      className="border-t mt-20 transition-colors duration-200"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b" style={{ borderColor: "var(--border)" }}>
          
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <h2 className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
              💼 <span>Job Portal</span>
            </h2>
            <p
              className="mt-4 text-sm leading-relaxed max-w-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Connecting ambitious professionals with world-class companies. Build your profile, discover verified listings, and take your career to the next level.
            </p>
            {/* Social Icons Placeholder */}
            <div className="flex space-x-4 mt-6">
              {['🌐', '🐦', '📸', '💼'].map((emoji, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-9 h-9 rounded-full flex items-center justify-center border hover:scale-105 transition-all text-sm"
                  style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.02)" }}
                >
                  {emoji}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Candidates Link Group */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">For Candidates</h3>
            <ul className="space-y-2.5 text-sm">
              {['Browse Jobs', 'Career Advice', 'Resume Builder', 'Job Alerts', 'Saved Jobs'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="hover:underline transition-colors" style={{ color: "var(--text-muted)" }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Employers Link Group */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">For Employers</h3>
            <ul className="space-y-2.5 text-sm">
              {['Post a Job', 'Talent Search', 'Hiring Solutions', 'Pricing Plans', 'Enterprise Workflow'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="hover:underline transition-colors" style={{ color: "var(--text-muted)" }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter / Update Info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Stay Updated</h3>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Subscribe to get the latest job alerts and industry insights delivered to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full text-xs px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent"
                style={{ borderColor: "var(--border)" }}
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 rounded-md transition-colors shadow-sm">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Fine Print */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs gap-4">
          <p style={{ color: "var(--text-muted)" }}>
            © 2026 Job Portal. All rights reserved. Built for scalable recruitment management.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:underline" style={{ color: "var(--text-muted)" }}>Privacy Policy</a>
            <a href="#" className="hover:underline" style={{ color: "var(--text-muted)" }}>Terms of Service</a>
            <a href="#" className="hover:underline" style={{ color: "var(--text-muted)" }}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}