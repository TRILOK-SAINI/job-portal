import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sidebarLinks } from "../data/sidebarLinks";
import { FaSignOutAlt } from "react-icons/fa";

export default function Sidebar({
  isOpen,
  closeSidebar,
}) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const links = sidebarLinks[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:static z-50
          w-64 h-screen
          transition-transform duration-300
          border-r flex flex-col
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{
          background: "var(--sidebar)",
          borderColor: "var(--border)",
        }}
      >
        {/* Scrollable Links */}
      <div className="flex flex-col h-full">
  
  {/* Links */}
  <div className="flex-1 overflow-y-auto p-3">
    <nav className="flex flex-col gap-2">
      {links.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
            style={({ isActive }) => ({
              background: isActive
                ? "var(--primary)"
                : "transparent",
              color: isActive
                ? "#fff"
                : "var(--text)",
            })}
          >
            <Icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  </div>

  {/* Logout */}
  <div
    className="p-3 border-t sticky bottom-0"
    style={{
      background: "var(--sidebar)",
      borderColor: "var(--border)",
    }}
  >
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
      style={{
        background: "var(--card)",
        color: "var(--text)",
        border: `1px solid var(--border)`,
      }}
    >
      <FaSignOutAlt />
      Logout
    </button>
  </div>
</div>
      </aside>
    </>
  );
}