import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TestCard from "../components/TestCard";
import PredictCollegeModal from "../components/PredictCollegeModal";
import CollegeResultsTable from "../components/CollegeResultsTable";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [collegeResults, setCollegeResults] = useState(null);
  const [resultsFilter, setResultsFilter] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Only fetch if user exists
      if (!user?.id) {
        console.log("No user, skipping data fetch");
        setTests([]);
        setLoading(false);
        return;
      }

      const testsResponse = await api.get("/student/tests", { params: { userId: user.id } });
      setTests(testsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTests([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleAction = async (test, actionLabel) => {
    const mode = actionLabel === "Resume Test" ? "resume" : "new";
    const response = await api.post("/student/start-test", {
      userId: user.id,
      testId: test.id,
      mode,
    });
    navigate(`/test/${test.id}/${response.data.attempt.id}`);
  };

  const handlePredictResults = (data) => {
    setCollegeResults(data.colleges);
    setResultsFilter(data.filter);
    setShowPredictModal(false);
    // Store both above and below rank for the results component
    window.collegeResultsData = {
      colleges: data.colleges,
      above_rank: data.above_rank,
      below_rank: data.below_rank,
      filter: data.filter,
    };
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-2">BECULTS</h1>
          <h2 className="text-2xl font-semibold mb-3">Eamcet Mock Test Platform</h2>
          <p className="text-lg text-green-100">Grow your career from here</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Predict Colleges Button - Right Side */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowPredictModal(true)}
            className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            🎓 Predict Colleges
          </button>
        </div>

        {/* Tests Section */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Tests</h2>
          {tests.length === 0 ? (
            <p className="text-sm text-slate-600">No tests available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tests.map((test) => (
                <TestCard key={test.id} test={test} onAction={handleAction} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PredictCollegeModal
        isOpen={showPredictModal}
        onClose={() => setShowPredictModal(false)}
        onResults={handlePredictResults}
      />

      {collegeResults && (
        <CollegeResultsTable
          colleges={collegeResults}
          filter={resultsFilter}
          aboveRank={window.collegeResultsData?.above_rank || []}
          belowRank={window.collegeResultsData?.below_rank || []}
          onClose={() => {
            setCollegeResults(null);
            setResultsFilter(null);
            window.collegeResultsData = null;
          }}
        />
      )}
    </div>
  );
}
