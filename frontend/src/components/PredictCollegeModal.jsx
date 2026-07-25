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
  { value: "", label: "All Branches", shortcut: "ALL" },
  { value: "AGR", label: "Agricultural Engineering", shortcut: "AGR" },
  { value: "AI", label: "Artificial Intelligence", shortcut: "AI" },
  { value: "AID", label: "Artificial Intelligence and Data Science", shortcut: "AID" },
  { value: "AIM", label: "Artificial Intelligence and Machine Learning", shortcut: "AIM" },
  { value: "ASE", label: "Aerospace Engineering", shortcut: "ASE" },
  { value: "AUT", label: "Automobile Engineering", shortcut: "AUT" },
  { value: "BDT", label: "Dairy Technology", shortcut: "BDT" },
  { value: "BIO", label: "Bio-Technology", shortcut: "BIO" },
  { value: "CAD", label: "CSE (Artificial Intelligence & Data Science)", shortcut: "CAD" },
  { value: "CAI", label: "Computer Science & Engineering (Artificial Intelligence)", shortcut: "CAI" },
  { value: "CBA", label: "Computer Science Engineering (Big Data Analytics)", shortcut: "CBA" },
  { value: "CBC", label: "CSE – Block Chain", shortcut: "CBC" },
  { value: "CCC", label: "CSE – Cloud Computing", shortcut: "CCC" },
  { value: "CDA", label: "CSE – Data Analytics", shortcut: "CDA" },
  { value: "CHE", label: "Chemical Engineering", shortcut: "CHE" },
  { value: "CIA", label: "CSE with specialization in IoT & Automation", shortcut: "CIA" },
  { value: "CIC", label: "CSE (IoT & Cyber Security with Block Chain Technology)", shortcut: "CIC" },
  { value: "CIT", label: "Computer Science and Information Technology", shortcut: "CIT" },
  { value: "CIV", label: "Civil Engineering", shortcut: "CIV" },
  { value: "CN", label: "Computer Networking", shortcut: "CN" },
  { value: "CS", label: "Cyber Security", shortcut: "CS" },
  { value: "CSB", label: "Computer Science and Business Systems", shortcut: "CSB" },
  { value: "CSBS", label: "Computer Science and Biosciences", shortcut: "CSBS" },
  { value: "CSC", label: "Computer Science and Engineering (Cyber Security)", shortcut: "CSC" },
  { value: "CSD", label: "Computer Science and Engineering (Data Science)", shortcut: "CSD" },
  { value: "CSE", label: "Computer Science and Engineering", shortcut: "CSE" },
  { value: "CSEB", label: "Computer Science Engineering & Business Systems", shortcut: "CSEB" },
  { value: "CSED", label: "Computer Science and Engineering – DevOps", shortcut: "CSED" },
  { value: "CSG", label: "Computer Science and Design", shortcut: "CSG" },
  { value: "CSM", label: "CSE (Artificial Intelligence and Machine Learning)", shortcut: "CSM" },
  { value: "CSO", label: "Computer Science and Engineering (IoT)", shortcut: "CSO" },
  { value: "CSS", label: "Computer Science and Systems Engineering", shortcut: "CSS" },
  { value: "CST", label: "Computer Science and Technology", shortcut: "CST" },
  { value: "CSW", label: "Computer Engineering (Software Engineering)", shortcut: "CSW" },
  { value: "DS", label: "Data Science", shortcut: "DS" },
  { value: "DTD", label: "Digital Techniques for Design and Planning", shortcut: "DTD" },
  { value: "EBM", label: "Electronics and Communication Engineering (Bio-Medical Engineering)", shortcut: "EBM" },
  { value: "ECE", label: "Electronics and Communication Engineering", shortcut: "ECE" },
  { value: "ECES", label: "Electronics and Communication Engineering – Embedded Systems", shortcut: "ECES" },
  { value: "ECM", label: "Electronics and Computer Engineering", shortcut: "ECM" },
  { value: "ECT", label: "Electronics and Communication Technology", shortcut: "ECT" },
  { value: "ECV", label: "Electronics and Communication Engineering – VLSI Design", shortcut: "ECV" },
  { value: "EEE", label: "Electrical and Electronics Engineering", shortcut: "EEE" },
  { value: "EIE", label: "Electronics and Instrumentation Engineering", shortcut: "EIE" },
  { value: "EII", label: "Electronics and Communication Engineering (Industry Integrated)", shortcut: "EII" },
  { value: "ENV", label: "Environmental Engineering", shortcut: "ENV" },
  { value: "EVT", label: "Electronics Engineering (VLSI Design and Technology)", shortcut: "EVT" },
  { value: "FDE", label: "Food Engineering", shortcut: "FDE" },
  { value: "FDT", label: "Food Technology", shortcut: "FDT" },
  { value: "GDT", label: "Game Design Technology", shortcut: "GDT" },
  { value: "GIN", label: "Geo-Informatics", shortcut: "GIN" },
  { value: "INF", label: "Information Technology", shortcut: "INF" },
  { value: "IOT", label: "Internet of Things", shortcut: "IOT" },
  { value: "IST", label: "Instrumentation Engineering and Technology", shortcut: "IST" },
  { value: "MAD", label: "Mechanical Automotive Design", shortcut: "MAD" },
  { value: "MAU", label: "Mechanical Engineering (Automobile)", shortcut: "MAU" },
  { value: "MEC", label: "Mechanical Engineering", shortcut: "MEC" },
  { value: "MET", label: "Metallurgical Engineering", shortcut: "MET" },
  { value: "MII", label: "Mechanical Engineering (Industry Integrated)", shortcut: "MII" },
  { value: "MIN", label: "Mining Engineering", shortcut: "MIN" },
  { value: "MMM", label: "Mechanical and Mechatronics Engineering (Additive Manufacturing)", shortcut: "MMM" },
  { value: "MMT", label: "Metallurgy and Material Technology", shortcut: "MMT" },
  { value: "MRB", label: "Mechanical Engineering (Robotics)", shortcut: "MRB" },
  { value: "NAM", label: "Naval Architecture and Marine Engineering", shortcut: "NAM" },
  { value: "PEE", label: "Petroleum Engineering", shortcut: "PEE" },
  { value: "PET", label: "Petroleum Technology", shortcut: "PET" },
  { value: "PHD", label: "Doctor of Pharmacy (Pharm.D - M.P.C Stream)", shortcut: "PHD" },
  { value: "PHE", label: "Pharmaceutical Engineering", shortcut: "PHE" },
  { value: "PHM", label: "Bachelor of Pharmacy (B.Pharmacy - M.P.C Stream)", shortcut: "PHM" },
  { value: "PLG", label: "Planning", shortcut: "PLG" },
  { value: "QC", label: "Quantum Computing", shortcut: "QC" },
  { value: "RBT", label: "Robotics", shortcut: "RBT" },
  { value: "SWE", label: "Software Engineering", shortcut: "SWE" }
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
