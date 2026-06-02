import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowedRoles,
}) {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}