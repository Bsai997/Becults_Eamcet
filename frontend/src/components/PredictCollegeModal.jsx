import { useState } from "react";
import { api } from "../lib/api";

export default function PredictCollegeModal({ isOpen, onClose, onResults }) {
  const [rank, setRank] = useState("");
  const [caste, setCaste] = useState("OC");
  const [gender, setGender] = useState("BOYS");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const casteOptions = [
    { value: "OC", label: "OC (General)" },
    { value: "SC", label: "SC (Scheduled Caste)" },
    { value: "ST", label: "ST (Scheduled Tribe)" },
    { value: "BCA", label: "BC-A" },
    { value: "BCB", label: "BC-B" },
    { value: "BCC", label: "BC-C" },
    { value: "BCD", label: "BC-D" },
    { value: "BCE", label: "BC-E" },
    { value: "OC_EWS", label: "OC-EWS" },
  ];

  const branchOptions = [
    { value: "", label: "All Branches" },
    { value: "CSE", label: "Computer Science & Engineering" },
    { value: "ECE", label: "Electronics & Communication" },
    { value: "EEE", label: "Electrical & Electronics" },
    { value: "MEC", label: "Mechanical Engineering" },
    { value: "CIV", label: "Civil Engineering" },
    { value: "CSM", label: "CSE - Specialization" },
    { value: "CSD", label: "CSD" },
    { value: "INF", label: "Information Technology" },
    { value: "PHD", label: "Pharmacy" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!rank || parseInt(rank) <= 0) {
        throw new Error("Please enter a valid rank");
      }

      const response = await api.post("/student/predict-colleges", {
        rank: parseInt(rank),
        caste,
        gender,
        branch: branch || undefined,
      });

      // Pass colleges, filter info, and both above_rank and below_rank arrays
      onResults({
        colleges: response.data.colleges,
        above_rank: response.data.above_rank || [],
        below_rank: response.data.below_rank || [],
        filter: {
          rank: parseInt(rank),
          caste,
          gender,
          branch: branch || "All Branches",
        },
      });
      
      // Reset form
      setRank("");
      setCaste("OC");
      setGender("BOYS");
      setBranch("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch colleges");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Predict Colleges</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rank Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Rank *
            </label>
            <input
              type="number"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g., 5000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Caste Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={caste}
              onChange={(e) => setCaste(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              {casteOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gender *
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="BOYS">Boys</option>
              <option value="GIRLS">Girls</option>
            </select>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Branch (Optional)
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {branchOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition"
            >
              {loading ? "Searching..." : "Search Colleges"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Results will show colleges where you can secure admission based on your rank
        </p>
      </div>
    </div>
  );
}
