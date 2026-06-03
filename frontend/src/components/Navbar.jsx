import { useState, useEffect } from "react";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();

  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header
      className="h-16 border-b flex items-center justify-between px-5 md:px-6 shrink-0 z-40"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 rounded-lg transition hover:opacity-70"
          style={{ color: "var(--text)" }}
          aria-label="Toggle sidebar"
        >
          <FaBars size={16} />
        </button>

        <h1
          className="font-bold text-xl tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Job Portal
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border transition hover:opacity-80"
          style={{
            borderColor: "var(--border)",
            color: "var(--text)",
            background: "var(--bg)",
          }}
          aria-label="Toggle theme"
        >
          {isDark ? <FaSun size={15} /> : <FaMoon size={15} />}
        </button>

        <div className="flex items-center gap-2.5">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=random`}
            alt="avatar"
            className="w-9 h-9 rounded-full shrink-0"
          />

          <div className="hidden sm:block">
            <p
              className="text-sm font-semibold leading-tight"
              style={{ color: "var(--text)" }}
            >
              {user?.name || "User"}
            </p>
            <p
              className="text-xs capitalize leading-tight mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}