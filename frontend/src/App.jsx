import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";

import AdminDashboard from "./pages/admin/Dashboard";
// employer import EmployerDashboard from "./pages/employer/EmployerDashboard";
import CompanyProfile from "./pages/employer/CompanyProfile";
import EmployerDashboard from "./pages/employer/EmployerDashboard";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateJobs from "./pages/candidate/CandidateJob";
import CandidateApplication from "./pages/candidate/CandidateApplication";
import CandidateProfile from "./pages/candidate/CandidateProfile";

import ProtectedRoute from "./routes/ProtectedRoute";

// Public Pages
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/public/Home";
import Jobs from "./pages/public/Jobs";
import JobDetails from "./pages/public/JobDetails";
import Companies from "./pages/public/Companies";
import EmployerJobs from "./pages/employer/EmployerJobs";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />



<Route element={<PublicLayout />}>
  <Route
    path="/"
    element={<Home />}
  />

  <Route
    path="/jobs"
    element={<Jobs />}
  />

  <Route
    path="/jobs/:id"
    element={<JobDetails />}
  />
  
  <Route
    path="/companies"
    element={<Companies />}
  />
</Route>

      {/* admin routes */}
     {/* Candidate Routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["candidate"]}
          />
        }
      >
        <Route
          path="/candidate"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<CandidateDashboard />}
          />

          <Route
            path="jobs"
            element={<CandidateJobs />}
          />

          <Route
            path="applications"
            element={<CandidateApplication />}
          />

          <Route
            path="profile"
            element={<CandidateProfile />}
          />
        </Route>
      </Route>

      {/* Employer Routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["employer"]}
          />
        }
      >
        <Route
          path="/employer"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<EmployerDashboard />}
          />
          <Route
            path="profile"
            element={<CompanyProfile />}
            />

            <Route
            path="jobs"
            element={<EmployerJobs />}
            />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          />
        }
      >
        <Route
          path="/admin"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<AdminDashboard />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;