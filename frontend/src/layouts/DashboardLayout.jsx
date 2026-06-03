import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* Navbar sits in normal flow, takes its 64px */}
      <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />

      {/* Everything below navbar fills remaining height */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isOpen}
          closeSidebar={() => setIsOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}