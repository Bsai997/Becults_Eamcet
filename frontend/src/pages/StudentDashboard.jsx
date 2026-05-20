import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TestCard from "../components/TestCard";
import PerformanceCard from "../components/PerformanceCard";
import PredictCollegeModal from "../components/PredictCollegeModal";
import CollegeResultsTable from "../components/CollegeResultsTable";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [collegeResults, setCollegeResults] = useState(null);
  const [resultsFilter, setResultsFilter] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const [testsResponse, perfResponse] = await Promise.all([
      api.get("/student/tests", { params: { userId: user.id } }),
      api.get("/student/performance", { params: { userId: user.id } }),
    ]);
    setTests(testsResponse.data);
    setPerformance(perfResponse.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">BECULTS.EAMCET</h1>
              <p className="text-sm text-slate-600">{user?.email}</p>
            </div>
            <div className="flex gap-2 flex-col sm:flex-row">
              <button
                onClick={() => setShowPredictModal(true)}
                className="rounded-xl bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 transition-colors sm:px-4 sm:py-2 sm:text-base whitespace-nowrap font-semibold"
              >
                🎓 Predict Colleges
              </button>
              <button
                onClick={logout}
                className="self-start rounded-xl bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800 transition-colors sm:self-auto sm:px-4 sm:py-2 sm:text-base whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
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

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Performance</h2>
          {performance.length === 0 ? (
            <p className="text-sm text-slate-600">No completed attempts yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {performance.map((entry) => (
                <PerformanceCard
                  key={entry.attempt_id}
                  item={entry}
                  onView={() => navigate(`/result/${entry.attempt_id}`)}
                />
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
