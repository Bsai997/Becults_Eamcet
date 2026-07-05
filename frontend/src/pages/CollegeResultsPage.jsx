import { useNavigate, useLocation } from "react-router-dom";
import CollegeResultsTable from "../components/CollegeResultsTable";

export default function CollegeResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colleges = [], above_rank = [], below_rank = [], filter = {} } = location.state || {};

  if (!filter.rank) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-6">Please search for colleges first</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div>

        <CollegeResultsTable
          colleges={colleges}
          filter={filter}
          aboveRank={above_rank}
          belowRank={below_rank}
          onClose={() => navigate("/")}
        />
      </div>
    </div>
  );
}
