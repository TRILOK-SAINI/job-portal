import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        background: "var(--bg)",
      }}
    >
      <Navbar
        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }
      />

      <div className="flex h-[calc(100vh-64px)] pt-16">
        <Sidebar
          isOpen={isOpen}
          closeSidebar={() =>
            setIsOpen(false)
          }
        />

        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}