import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPerformance from "./pages/StudentPerformance";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import CollegeResultsPage from "./pages/CollegeResultsPage";
import CounsellingPage from "./pages/CounsellingPage";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();
  
  // Check both context state and localStorage for user
  const currentUser = user || JSON.parse(localStorage.getItem("otp_user") || "null");
  
  if (!currentUser) return <Navigate to="/" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Landing Page - Public */}
      <Route path="/" element={<LandingPage />} />
      
      
      {/* College Results Page - Public */}
      <Route path="/college-results" element={<CollegeResultsPage />} />

      {/* Counselling Page - Public */}
      <Route path="/counselling" element={<CounsellingPage />} />
      
      {/* Login Page - Public */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Student Dashboard - Protected */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Protected routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/student-performance"
        element={
          <ProtectedRoute role="admin">
            <StudentPerformance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test/:testId/:attemptId"
        element={
          <ProtectedRoute role="student">
            <TestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result/:attemptId"
        element={
          <ProtectedRoute role="student">
            <ResultPage />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}