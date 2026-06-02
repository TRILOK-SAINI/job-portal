import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/public/PublicNavbar";
import PublicFooter       from "../components/public/PublicFooter";

export default function PublicLayout() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg)",
      }}
    >
      <PublicNavbar />

      <main>
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}