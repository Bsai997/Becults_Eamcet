import { useState } from "react";
import html2pdf from "html2pdf.js";

export default function CollegeResultsTable({ colleges, filter, onClose, aboveRank, belowRank }) {
  const [sortBy, setSortBy] = useState("cutoff_rank");
  const [filterPlace, setFilterPlace] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Get unique places for filter
  const uniquePlaces = [...new Set(colleges.map((c) => c.place))].sort();

  // Combine all colleges
  const allColleges = [...(aboveRank || []), ...(belowRank || [])];

  // Separate colleges into High Chances and Less Chances
  const highChancesColleges = allColleges.filter(c => filter.rank <= c.cutoff_rank);
  const lessChancesColleges = allColleges.filter(c => filter.rank > c.cutoff_rank);

  // Apply filtering and sorting to both categories
  const getFilteredAndSorted = (collegesList) => {
    return collegesList
      .filter((c) => !filterPlace || c.place === filterPlace)
      .sort((a, b) => {
        if (sortBy === "cutoff_rank") {
          return a.cutoff_rank - b.cutoff_rank;
        } else if (sortBy === "college_fee") {
          return a.college_fee - b.college_fee;
        } else if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  };

  const filteredHighChances = getFilteredAndSorted(highChancesColleges);
  const filteredLessChances = getFilteredAndSorted(lessChancesColleges);

  const validateForm = () => {
    setFormError("");
    if (!name.trim()) {
      setFormError("Name is required");
      return false;
    }
    if (!mobileNo.trim()) {
      setFormError("Mobile number is required");
      return false;
    }
    if (!/^[0-9]{10}$/.test(mobileNo.trim())) {
      setFormError("Mobile number must be 10 digits");
      return false;
    }
    return true;
  };

  const saveTOGoogleSheet = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/student/save-prediction-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          mobileNo: mobileNo.trim(),
          rank: filter.rank,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Response Error:", errorText);
        throw new Error(`Failed to save data to Google Sheets: ${response.statusText}`);
      }

      // After successful submission, generate and download PDF
      generateAndDownloadPDF();
      setShowForm(false);
      setName("");
      setMobileNo("");
    } catch (error) {
      console.error("Error saving to Google Sheets:", error);
      setFormError(error.message || "Failed to save data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAndDownloadPDF = () => {
    if (filteredHighChances.length === 0 && filteredLessChances.length === 0) {
      alert("No data to download. Please search first.");
      return;
    }

    // Create HTML content for PDF
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>EAMCET.Cults</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              color: #333;
              background: white;
            }
            body { padding: 30px 20px; }
            
           .header {
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 18px;
  border-bottom: 2px solid #1A699F;
}

.header h1 {
  font-size: 30px;
  color: #1A699F;
  font-weight: 700;
  margin-bottom: 6px;
}

.header h2{
  font-size:16px;
  color:#000;
  font-weight:600;
  margin-bottom:4px;
}

.header p{
  font-size:13px;
  color:#D3540D;
  font-weight:600;
}
            
.student-card{
    border:1px solid #E5E7EB;
    border-radius:8px;
    padding:18px;
    margin-bottom:25px;
    background:#fff;
}

.student-title{
    font-size:16px;
    font-weight:700;
    color:#1A699F;
    margin-bottom:15px;
    border-bottom:1px solid #E5E7EB;
    padding-bottom:8px;
}

.filter-section{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:15px 30px;
}

.filter-item{
    font-size:13px;
}

.filter-item strong{
    color:#000;
}
.section-header.high{

background:#ECF3F8;

color:#1A699F;

border-left:6px solid #1A699F;

padding:14px 18px;

font-size:16px;

font-weight:700;

border-radius:6px;

margin-bottom:10px;

box-shadow:none;
}
.section-header.less{

background:#FEF3E2;

color:#D3540D;

border-left:6px solid #D3540D;

padding:14px 18px;

font-size:16px;

font-weight:700;

border-radius:6px;

margin-bottom:10px;

box-shadow:none;
}.table-high th{

background:#1A699F;

color:#000;

border:none;

font-size:12px;

padding:12px;
}
.table-less th{

background:transparent;

color:#D3540D;

border:2px solid #D3540D;

font-size:12px;

padding:12px;

font-weight:700;
}
td{

padding:11px;

border:1px solid #E5E7EB;

font-size:11px;

color:#000;
}.table-high tbody tr:nth-child(odd){

background:#FFFFFF;

}

.table-high tbody tr:nth-child(even){

background:#ECF3F8;

}
.table-less tbody tr:nth-child(odd){

background:#FFFFFF;

}

.table-less tbody tr:nth-child(even){

background:#FEF3E2;

}
.footer{

margin-top:30px;

border-top:2px solid #E5E7EB;

padding-top:15px;

text-align:center;

font-size:11px;

color:#555;
}
          </style>
        </head>
        <body>
         <div class="header">
    <h1>EAMCET.Cults</h1>
    <h2>Engineering College Prediction Report</h2>
</div>
<div class="student-card">
<div class="filter-section">
<div class="filter-item">
<strong>Name :</strong> ${name}
</div>
<div class="filter-item">
<strong>Rank :</strong> ${filter.rank}
</div>

<div class="filter-item">
<strong>Gender :</strong> ${filter.gender}
</div>

<div class="filter-item">
<strong>Category :</strong> ${filter.caste}
</div>

<div class="filter-item">
<strong>Generated :</strong> ${new Date().toLocaleDateString()}
</div>

</div>

</div>
          ${filteredHighChances.length > 0 ? `
            <div class="section-header high">
              HIGH CHANCES <span class="count">(${filteredHighChances.length} Colleges)</span>
            </div>
            <table class="table-high">
              <thead>
                <tr>
                  <th class="sno">S.No</th>
                  <th>College Name</th>
                  <th>Location</th>
                  <th>Branch</th>
                  <th style="text-align: center;">Cutoff Rank</th>
                  <th style="text-align: right;">Fee (₹)</th>
                  <th>Affiliation</th>
                </tr>
              </thead>
              <tbody>
                ${filteredHighChances
          .map(
            (college, idx) => `
                  <tr>
                    <td class="sno">${idx + 1}</td>
                    <td class="college-name">${college.name || 'N/A'}</td>
                    <td class="location">${college.place || 'N/A'}</td>
                    <td class="branch">${college.branch || 'N/A'}</td>
                    <td class="rank">${college.cutoff_rank ? college.cutoff_rank.toLocaleString() : 'N/A'}</td>
                    <td style="text-align: right;">₹${college.college_fee ? college.college_fee.toLocaleString() : 'N/A'}</td>
                    <td class="affiliation">${college.affiliated || 'N/A'}</td>
                  </tr>
                `
          )
          .join("")}
              </tbody>
            </table>
          ` : ''}

          ${filteredLessChances.length > 0 ? `
            <div class="section-header less">
               LESS CHANCES <span class="count">(${filteredLessChances.length} Colleges)</span>
            </div>
            <table class="table-less">
              <thead>
                <th class="sno">S.No</th>
                  <th>College Name</th>
                  <th>Location</th>
                  <th>Branch</th>
                  <th style="text-align: center;">Cutoff Rank</th>
                  <th style="text-align: right;">Fee (₹)</th>
                  <th>Affiliation</th>
              </thead>
              <tbody>
                ${filteredLessChances
          .map(
            (college, idx) => `
                  <tr>
                    <td class="sno">${filteredHighChances.length + idx + 1}</td>
                    <td class="college-name">${college.name || 'N/A'}</td>
                    <td class="location">${college.place || 'N/A'}</td>
                    <td class="branch">${college.branch || 'N/A'}</td>
                    <td class="rank">${college.cutoff_rank ? college.cutoff_rank.toLocaleString() : 'N/A'}</td>
                    <td style="text-align: right;">₹${college.college_fee ? college.college_fee.toLocaleString() : 'N/A'}</td>
                    <td class="affiliation">${college.affiliated || 'N/A'}</td>
                  </tr>
                `
          )
          .join("")}
              </tbody>
            </table>
          ` : ''}

          <div class="footer">

<p style="margin-top:8px;">
Predictions are based on previous year's cutoff ranks.
Actual allotment depends on official counselling and seat availability.
</p>

</div>
        </body>
      </html>
    `;

    // Create a temporary element
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `BECULTS_EAMCET${name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, allowTaint: true },
      jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(element.innerHTML)
      .save()
      .catch((error) => {
        console.error("PDF generation error:", error);
        alert("Failed to generate PDF. Please try again or contact support.");
      });
  };

  const handleDownloadPDF = () => {
    if (filteredHighChances.length === 0 && filteredLessChances.length === 0) {
      alert("No data to download. Please search first.");
      return;
    }
    // Show form instead of directly downloading
    setShowForm(true);
  };

  return (
    <>
      {/* Form Popup Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Download College List</h3>
            <p className="text-gray-600 mb-6">Please enter your details to download the college predictions PDF</p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Rank
                </label>
                <input
                  type="number"
                  value={filter.rank}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                  setName("");
                  setMobileNo("");
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={saveTOGoogleSheet}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-[#1A699F] text-white rounded-lg hover:bg-[#1A699F] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Not Modal */}
      <div className="bg-white w-full">
        {/* Header */}
        <div className="border-b px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-b from-[#F1F8FC] to-[#E0EFF9]">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              College Predictions
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Rank: <span className="font-bold text-blue-600">{filter.rank}</span> | Category:{" "}
              <span className="font-bold text-blue-600">{filter.caste}</span> | Gender:{" "}
              <span className="font-bold text-blue-600">{filter.gender}</span> | High: <span className="font-bold text-green-600">{filteredHighChances.length}</span> | Less: <span className="font-bold text-orange-600">{filteredLessChances.length}</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="border-b px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Sort Dropdown */}
            <div className="flex-1 sm:flex-none">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="cutoff_rank">Cutoff Rank</option>
                <option value="college_fee">College Fee</option>
                <option value="name">College Name</option>
              </select>
            </div>

            {/* Place Filter */}
            <div className="flex-1 sm:flex-none">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1">
                Location
              </label>
              <select
                value={filterPlace}
                onChange={(e) => setFilterPlace(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {uniquePlaces.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="px-3 sm:px-4 py-2 bg-[#D3540D] text-white rounded-lg hover:bg-[#D3540D] font-semibold text-xs sm:text-sm transition whitespace-nowrap"
          >
            Download as PDF
          </button>
        </div>

        {/* Table - Desktop View */}
        <div className="hidden sm:block overflow-x-auto p-4 sm:p-6">
          {filteredHighChances.length === 0 && filteredLessChances.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No colleges found for selected filters</p>
            </div>
          ) : (
            <>
              {/* HIGH CHANCES TABLE */}
              {filteredHighChances.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-8 bg-[#1A699F] rounded"></div>
                    <h3 className="text-xl font-bold text-[#1A699F]">🎯 HIGH CHANCES ({filteredHighChances.length})</h3>
                    <span className="text-xs text-gray-600 ml-auto">Your Rank ≤ Cutoff Rank - Good Probability</span>
                  </div>
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#b1d5ed]">
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">S.No</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">College Name</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">Location</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">Branch</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-semibold text-gray-700">Cutoff</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-semibold text-gray-700">Fee (₹)</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">Affiliation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHighChances.map((college, idx) => (
                        <tr
                          key={`high-${idx}`}
                          className="border-b border-[#b1d5ed] bg-[#ecf3f8] hover:bg-[#d1e9f8] transition"
                        >
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 font-semibold text-xs sm:text-sm text-center">{idx + 1}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-800 text-xs sm:text-sm">{college.name}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 text-xs sm:text-sm">{college.place}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm">{college.branch}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-center font-bold text-[#1A699F] text-xs sm:text-sm">
                            {college.cutoff_rank.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-center text-gray-700 text-xs sm:text-sm">
                            {college.college_fee ? `₹${(college.college_fee / 1000).toFixed(0)}K` : "N/A"}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 text-xs">{college.affiliated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* LESS CHANCES TABLE */}
              {filteredLessChances.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-8 bg-orange-500 rounded"></div>
                    <h3 className="text-xl font-bold text-orange-700">⭐ LESS CHANCES ({filteredLessChances.length})</h3>
                    <span className="text-xs text-gray-600 ml-auto">Your Rank {'>'}  Cutoff Rank - Lower Probability</span>
                  </div>
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">S.No</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">College Name</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">Location</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">Branch</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-semibold text-gray-700">Cutoff</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-semibold text-gray-700">Fee (₹)</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">Affiliation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLessChances.map((college, idx) => (
                        <tr
                          key={`less-${idx}`}
                          className="border-b bg-orange-50 hover:bg-orange-100 transition"
                        >
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 font-semibold text-xs sm:text-sm text-center">{idx + 1}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-800 text-xs sm:text-sm">{college.name}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 text-xs sm:text-sm">{college.place}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm">{college.branch}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-center font-bold text-orange-600 text-xs sm:text-sm">
                            {college.cutoff_rank.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-center text-gray-700 text-xs sm:text-sm">
                            {college.college_fee ? `₹${(college.college_fee / 1000).toFixed(0)}K` : "N/A"}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 text-xs">{college.affiliated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Card View - Mobile */}
        <div className="sm:hidden p-4 space-y-3">
          {filteredHighChances.length === 0 && filteredLessChances.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No colleges found</p>
            </div>
          ) : (
            <>
              {filteredHighChances.length > 0 && (
                <div>
                  <div className="bg-[#ecf3f8] p-3 rounded-lg mb-3 border-b-2 border-[#b1d5ed]">
                    <h3 className="font-bold text-[#1A699F]">🎯 HIGH CHANCES ({filteredHighChances.length})</h3>
                  </div>
                  {filteredHighChances.map((college, idx) => (
                    <div key={`high-mobile-${idx}`} className="rounded-lg p-4 bg-[#ecf3f8] mb-2 shadow-sm border-l-4 border-[#1A699F]">
                      <div className="font-bold text-sm text-[#1A699F] mb-3">{college.name}</div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <p><span className="font-semibold text-gray-700">Branch:</span> <span className="text-gray-600">{college.branch}</span></p>
                          <p><span className="font-semibold text-gray-700">Rank:</span> <span className="font-bold text-[#1A699F]">{college.cutoff_rank.toLocaleString()}</span></p>
                          <p><span className="font-semibold text-gray-700">Location:</span> <span className="text-gray-600">{college.place}</span></p>
                          <p><span className="font-semibold text-gray-700">Fee:</span> <span className="text-gray-600">₹{college.college_fee ? college.college_fee.toLocaleString() : 'N/A'}</span></p>
                          <p className="col-span-2"><span className="font-semibold text-gray-700">Affiliation:</span> <span className="text-gray-600">{college.affiliated}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredLessChances.length > 0 && (
                <div>
                  <div className="bg-orange-50 p-3 rounded-lg mb-3 mt-4 border-b-2 border-orange-300">
                    <h3 className="font-bold text-orange-700">⭐ LESS CHANCES ({filteredLessChances.length})</h3>
                  </div>
                  {filteredLessChances.map((college, idx) => (
                    <div key={`less-mobile-${idx}`} className="rounded-lg p-4 bg-orange-50 mb-2 shadow-sm border-l-4 border-orange-500">
                      <div className="font-bold text-sm text-orange-700 mb-3">{college.name}</div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <p><span className="font-semibold text-gray-700">Branch:</span> <span className="text-gray-600">{college.branch}</span></p>
                          <p><span className="font-semibold text-gray-700">Rank:</span> <span className="font-bold text-orange-600">{college.cutoff_rank.toLocaleString()}</span></p>
                          <p><span className="font-semibold text-gray-700">Location:</span> <span className="text-gray-600">{college.place}</span></p>
                          <p><span className="font-semibold text-gray-700">Fee:</span> <span className="text-gray-600">₹{college.college_fee ? college.college_fee.toLocaleString() : 'N/A'}</span></p>
                          <p className="col-span-2"><span className="font-semibold text-gray-700">Affiliation:</span> <span className="text-gray-600">{college.affiliated}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
