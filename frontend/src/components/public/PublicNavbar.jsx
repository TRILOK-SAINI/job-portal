import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicNavbar() {
  const { user } = useAuth();

  // Reusable active link style handler
  const linkStyle = ({ isActive }) => ({
    color: isActive ? "var(--primary)" : "var(--text)",
    fontWeight: isActive ? "600" : "400",
  });

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md bg-opacity-95"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        
        {/* 1. LOGO CONTAINER (Designed to fit any uploaded image smoothly) */}
        <Link to="/" className="flex items-center h-full max-w-[180px]">
          {/* Option A: Image Logo (Uncomment and replace src when ready) */}
          {/* <img 
            src="/path-to-your-logo.png" 
            alt="Job Portal Logo" 
            className="h-9 w-auto object-contain max-w-full" 
          /> */}

          {/* Option B: Fallback Text Logo (Remove when adding your image) */}
          <span 
            className="text-xl font-extrabold tracking-tight flex items-center gap-1.5"
            style={{ color: "var(--text)" }}
          >
            💼 JobPortal
          </span>
        </Link>

        {/* 2. CENTER LINKS */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <NavLink 
            to="/" 
            style={linkStyle}
            className="text-sm transition-colors hover:opacity-80"
          >
            Home
          </NavLink>

          <NavLink 
            to="/jobs" 
            style={linkStyle}
            className="text-sm transition-colors hover:opacity-80"
          >
            Find Jobs
          </NavLink>

          <NavLink 
            to="/companies" 
            style={linkStyle}
            className="text-sm transition-colors hover:opacity-80"
          >
            Companies
          </NavLink>

          <NavLink 
            to="/pricing" 
            style={linkStyle}
            className="text-sm transition-colors hover:opacity-80"
          >
            Pricing
          </NavLink>
        </nav>

        {/* 3. RIGHT SIDE AUTH LINK */}
        <div className="flex items-center gap-4">
          {user ? (
            <NavLink
              to={user.role === "employer" ? "/employer" : "/candidate"}
              className="px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm transition-transform active:scale-95"
              style={{
                background: "var(--primary)",
              }}
            >
              Dashboard
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm transition-transform active:scale-95"
              style={{
                background: "var(--primary)",
              }}
            >
              Login / Sign Up
            </NavLink>
          )}
        </div>

      </div>
    </header>
  );
}