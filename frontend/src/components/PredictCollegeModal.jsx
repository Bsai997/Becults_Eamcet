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
    { value: "OC", label: "OC/General" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
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
      
      setRank("");
      setCaste("OC");
      setGender("BOYS");
      setBranch("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch colleges");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" style={{ border: "1px solid #e5e7eb" }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rank Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Rank
            </label>
            <input
              type="number"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g. 15,400"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              style={{ boxShadow: "0px 4px 4px 0px #13456866" }}
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category
            </label>
            <select
              value={caste}
              onChange={(e) => setCaste(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              style={{ boxShadow: "0px 4px 4px 0px #13456866" }}
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
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Gender
            </label>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden" style={{ boxShadow: "0px 4px 4px 0px #13456866" }}>
              <button
                type="button"
                onClick={() => setGender("BOYS")}
                className="flex-1 px-4 py-3 font-semibold transition-colors duration-300"
                style={{
                  backgroundColor: gender === "BOYS" ? "#1A699F" : "#f9fafb",
                  color: gender === "BOYS" ? "white" : "#374151",
                  borderRight: "1px solid #e5e7eb"
                }}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("GIRLS")}
                className="flex-1 px-4 py-3 font-semibold transition-colors duration-300"
                style={{
                  backgroundColor: gender === "GIRLS" ? "#1A699F" : "#f9fafb",
                  color: gender === "GIRLS" ? "white" : "#374151",
                }}
              >
                Female
              </button>
            </div>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Select Branches (Optional)
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              style={{ boxShadow: "0px 4px 4px 0px #13456866" }}
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 transition"
            style={{ backgroundColor: "#D3540D" }}
          >
            {loading ? "Searching..." : "Search Colleges"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </form>

        {/* No Sign-up Required */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          No Sign-up Required
        </p>
      </div>
    </div>
  );
}
