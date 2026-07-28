import { useState } from "react";
import { api } from "../lib/api";

export default function PredictCollegeModal({ isOpen, onClose, onResults }) {
  const [rank, setRank] = useState("");
  const [caste, setCaste] = useState("OC");
  const [gender, setGender] = useState("BOYS");
  const [branches, setBranches] = useState([]);
  const [branchSearch, setBranchSearch] = useState("");
  const [showAllBranches, setShowAllBranches] = useState(false);
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
    { value: "AGR", label: "Agricultural Engineering" },
    { value: "AI", label: "Artificial Intelligence" },
    { value: "AID", label: "Artificial Intelligence and Data Science" },
    { value: "AIM", label: "Artificial Intelligence and Machine Learning" },
    { value: "ASE", label: "Aerospace Engineering" },
    { value: "AUT", label: "Automobile Engineering" },
    { value: "BDT", label: "Dairy Technology" },
    { value: "BIO", label: "Bio-Technology" },
    { value: "CAD", label: "CSE (Artificial Intelligence & Data Science)" },
    { value: "CAI", label: "Computer Science & Engineering (Artificial Intelligence)" },
    { value: "CBA", label: "Computer Science Engineering (Big Data Analytics)" },
    { value: "CBC", label: "CSE – Block Chain" },
    { value: "CCC", label: "CSE – Cloud Computing" },
    { value: "CDA", label: "CSE – Data Analytics" },
    { value: "CHE", label: "Chemical Engineering" },
    { value: "CIA", label: "CSE with specialization in IoT & Automation" },
    { value: "CIC", label: "CSE (IoT & Cyber Security with Block Chain Technology)" },
    { value: "CIT", label: "Computer Science and Information Technology" },
    { value: "CIV", label: "Civil Engineering" },
    { value: "CN", label: "Computer Networking" },
    { value: "CS", label: "Cyber Security" },
    { value: "CSB", label: "Computer Science and Business Systems" },
    { value: "CSBS", label: "Computer Science and Biosciences" },
    { value: "CSC", label: "Computer Science and Engineering (Cyber Security)" },
    { value: "CSD", label: "Computer Science and Engineering (Data Science)" },
    { value: "CSE", label: "Computer Science and Engineering" },
    { value: "CSEB", label: "Computer Science Engineering & Business Systems" },
    { value: "CSED", label: "Computer Science and Engineering – DevOps" },
    { value: "CSG", label: "Computer Science and Design" },
    { value: "CSM", label: "CSE (Artificial Intelligence and Machine Learning)" },
    { value: "CSO", label: "Computer Science and Engineering (IoT)" },
    { value: "CSS", label: "Computer Science and Systems Engineering" },
    { value: "CST", label: "Computer Science and Technology" },
    { value: "CSW", label: "Computer Engineering (Software Engineering)" },
    { value: "DS", label: "Data Science" },
    { value: "DTD", label: "Digital Techniques for Design and Planning" },
    { value: "EBM", label: "Electronics and Communication Engineering (Bio-Medical Engineering)" },
    { value: "ECE", label: "Electronics and Communication Engineering" },
    { value: "ECES", label: "Electronics and Communication Engineering – Embedded Systems" },
    { value: "ECM", label: "Electronics and Computer Engineering" },
    { value: "ECT", label: "Electronics and Communication Technology" },
    { value: "ECV", label: "Electronics and Communication Engineering – VLSI Design" },
    { value: "EEE", label: "Electrical and Electronics Engineering" },
    { value: "EIE", label: "Electronics and Instrumentation Engineering" },
    { value: "EII", label: "Electronics and Communication Engineering (Industry Integrated)" },
    { value: "ENV", label: "Environmental Engineering" },
    { value: "EVT", label: "Electronics Engineering (VLSI Design and Technology)" },
    { value: "FDE", label: "Food Engineering" },
    { value: "FDT", label: "Food Technology" },
    { value: "GDT", label: "Game Design Technology" },
    { value: "GIN", label: "Geo-Informatics" },
    { value: "INF", label: "Information Technology" },
    { value: "IOT", label: "Internet of Things" },
    { value: "IST", label: "Instrumentation Engineering and Technology" },
    { value: "MAD", label: "Mechanical Automotive Design" },
    { value: "MAU", label: "Mechanical Engineering (Automobile)" },
    { value: "MEC", label: "Mechanical Engineering" },
    { value: "MET", label: "Metallurgical Engineering" },
    { value: "MII", label: "Mechanical Engineering (Industry Integrated)" },
    { value: "MIN", label: "Mining Engineering" },
    { value: "MMM", label: "Mechanical and Mechatronics Engineering (Additive Manufacturing)" },
    { value: "MMT", label: "Metallurgy and Material Technology" },
    { value: "MRB", label: "Mechanical Engineering (Robotics)" },
    { value: "NAM", label: "Naval Architecture and Marine Engineering" },
    { value: "PEE", label: "Petroleum Engineering" },
    { value: "PET", label: "Petroleum Technology" },
    { value: "PHD", label: "Doctor of Pharmacy (Pharm.D - M.P.C Stream)" },
    { value: "PHE", label: "Pharmaceutical Engineering" },
    { value: "PHM", label: "Bachelor of Pharmacy (B.Pharmacy - M.P.C Stream)" },
    { value: "PLG", label: "Planning" },
    { value: "QC", label: "Quantum Computing" },
    { value: "RBT", label: "Robotics" },
    { value: "SWE", label: "Software Engineering" },
  ];

  const handleSelectBranch = (branchCode) => {
    if (!branches.includes(branchCode)) {
      setBranches([...branches, branchCode]);
    }
    setBranchSearch("");
  };

  const handleRemoveBranch = (branchCode) => {
    setBranches(branches.filter((b) => b !== branchCode));
  };

  const filteredBranchOptions = branchOptions.filter(
    (opt) =>
      !branches.includes(opt.value) &&
      (opt.label.toLowerCase().includes(branchSearch.toLowerCase()) ||
        opt.value.toLowerCase().includes(branchSearch.toLowerCase()))
  );

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
        branch: branches.length > 0 ? branches : undefined,
      });

      onResults({
        colleges: response.data.colleges,
        above_rank: response.data.above_rank || [],
        below_rank: response.data.below_rank || [],
        filter: {
          rank: parseInt(rank),
          caste,
          gender,
          branch: branches.length > 0 ? branches.join(", ") : "All Branches",
        },
      });

      setRank("");
      setCaste("OC");
      setGender("BOYS");
      setBranches([]);
      setBranchSearch("");
      setShowAllBranches(false);
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
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        style={{ border: "1px solid #e5e7eb" }}
      >
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
            <div
              className="flex border border-gray-300 rounded-xl overflow-hidden"
              style={{ boxShadow: "0px 4px 4px 0px #13456866" }}
            >
              <button
                type="button"
                onClick={() => setGender("BOYS")}
                className="flex-1 px-4 py-3 font-semibold transition-colors duration-300"
                style={{
                  backgroundColor: gender === "BOYS" ? "#1A699F" : "#f9fafb",
                  color: gender === "BOYS" ? "white" : "#374151",
                  borderRight: "1px solid #e5e7eb",
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

          {/* Multi-Branch Field */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Select Branches (Optional)
            </label>

            {/* Input Box containing selected tags and inline search */}
            <div
              className="w-full min-h-[50px] p-2 border border-gray-300 rounded-xl flex flex-wrap gap-2 items-center bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
              style={{ boxShadow: "0px 4px 4px 0px #13456866" }}
            >
              {branches.map((code) => {
                const branchObj = branchOptions.find((b) => b.value === code);
                return (
                  <span
                    key={code}
                    className="bg-blue-100 text-blue-900 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-blue-200"
                  >
                    {branchObj ? branchObj.label : code}
                    <button
                      type="button"
                      onClick={() => handleRemoveBranch(code)}
                      className="text-blue-700 hover:text-red-600 font-bold transition ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                );
              })}

              <input
                type="text"
                placeholder={
                  branches.length === 0
                    ? "Type to search branch..."
                    : "Add another..."
                }
                value={branchSearch}
                onChange={(e) => {
                  setBranchSearch(e.target.value);
                  if (!showAllBranches) setShowAllBranches(true);
                }}
                onFocus={() => setShowAllBranches(true)}
                className="flex-1 min-w-[140px] border-none outline-none text-sm p-1 bg-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* "Show all branches" / "Hide branches" toggle button */}
            <div className="flex justify-between items-center mt-1.5 px-1">
              <button
                type="button"
                onClick={() => setShowAllBranches(!showAllBranches)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition underline flex items-center gap-1"
              >
                {showAllBranches ? "▲ Hide branches list" : "▼ Show all branches"}
              </button>
              {branches.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBranches([])}
                  className="text-xs text-red-500 hover:text-red-700 transition"
                >
                  Clear selected ({branches.length})
                </button>
              )}
            </div>

            {/* Branch options dropdown list */}
            {(showAllBranches || branchSearch.trim()) && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-1 bg-white shadow-lg z-20 space-y-1">
                {filteredBranchOptions.length === 0 ? (
                  <div className="text-xs text-gray-400 p-2 text-center">
                    No matching branches found
                  </div>
                ) : (
                  filteredBranchOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectBranch(opt.value)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-blue-50 hover:text-blue-700 transition flex items-center justify-between"
                    >
                      <span>{opt.label}</span>
                      <span className="font-semibold text-gray-400 ml-2">
                        + {opt.value}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
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