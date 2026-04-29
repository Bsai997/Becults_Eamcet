import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
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
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
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
    </Routes>
  );
}
