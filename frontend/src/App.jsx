import { Navigate, Route, Routes } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPerformance from "./pages/StudentPerformance";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Default route - always shows StudentDashboard */}
      <Route path="/" element={<StudentDashboard />} />
      
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
