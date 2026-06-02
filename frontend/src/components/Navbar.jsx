import {
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

export default function Navbar({
  toggleSidebar,
}) {
  const { user } = useAuth();

  const toggleTheme = () => {
    document.documentElement.classList.toggle(
      "dark"
    );
  };

  return (
    <header
     className="fixed top-0 left-0 right-0 z-40 h-16 border-b flex items-center justify-between px-4"
  style={{
    background: "var(--card)",
    borderColor: "var(--border)",
  }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <FaBars />
        </button>

        <h1
          className="font-bold text-xl"
          style={{
            color: "var(--text)",
          }}
        >
          Job Portal
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="text-lg"
          style={{
            color: "var(--text)",
          }}
        >
          {document.documentElement.classList.contains(
            "dark"
          ) ? (
            <FaSun />
          ) : (
            <FaMoon />
          )}
        </button>

        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${
              user?.name || "User"
            }`}
            alt="avatar"
            className="w-9 h-9 rounded-full"
          />

          <div className="hidden sm:block">
            <p
              className="font-medium"
              style={{
                color: "var(--text)",
              }}
            >
              {user?.name}
            </p>

            <p
              className="text-xs capitalize"
              style={{
                color: "var(--text-muted)",
              }}
            >
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}