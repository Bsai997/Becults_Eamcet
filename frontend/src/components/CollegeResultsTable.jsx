import { useState } from "react";
import html2pdf from "html2pdf.js";

export default function CollegeResultsTable({ colleges, filter, onClose, aboveRank, belowRank }) {
  const [sortBy, setSortBy] = useState("cutoff_rank");
  const [filterPlace, setFilterPlace] = useState("");

  // Get unique places for filter
  const uniquePlaces = [...new Set(colleges.map((c) => c.place))].sort();

  // Combine and filter colleges
  const allColleges = [...(aboveRank || []), ...(belowRank || [])];
  const filteredColleges = allColleges
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

  const handleDownloadPDF = () => {
    if (filteredColleges.length === 0) {
      alert("No data to download. Please search first.");
      return;
    }

    // Create HTML content for PDF
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>College Predictions Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              color: #333;
              background: white;
            }
            body { padding: 30px 20px; }
            
            .header { 
              margin-bottom: 30px; 
              padding-bottom: 20px;
              border-bottom: 3px solid #1e40af;
            }
            .header h1 { 
              font-size: 24px; 
              color: #1e40af; 
              margin-bottom: 12px;
              font-weight: 700;
            }
            .header p {
              font-size: 13px;
              color: #555;
              line-height: 1.6;
              margin: 5px 0;
            }
            
            .filter-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-top: 12px;
              padding-top: 12px;
              border-top: 1px solid #e5e7eb;
            }
            
            .filter-item {
              font-size: 12px;
              color: #666;
            }
            
            .filter-item strong {
              color: #1e40af;
              font-weight: 600;
            }
            
            table { 
              width: 100%; 
              border-collapse: collapse;
              margin-top: 20px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            th { 
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
              color: white;
              padding: 12px 10px;
              text-align: left;
              font-weight: 600;
              font-size: 12px;
              border: 1px solid #1e40af;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            td { 
              padding: 11px 10px;
              border: 1px solid #d1d5db;
              font-size: 11px;
              color: #374151;
            }
            
            tr:nth-child(even) td { 
              background-color: #f3f4f6;
            }
            
            tr:nth-child(odd) td { 
              background-color: #ffffff;
            }
            
            tbody tr:hover td {
              background-color: #eff6ff;
            }
            
            .sno { 
              text-align: center;
              font-weight: 600;
              color: #1e40af;
              width: 40px;
            }
            
            .rank { 
              color: #1e40af; 
              font-weight: 600;
              text-align: center;
            }
            
            .fee {
              text-align: right;
              font-weight: 500;
            }
            
            .college-name {
              font-weight: 600;
              color: #1f2937;
            }
            
            .location, .branch, .affiliation {
              color: #555;
            }
            
            .footer { 
              margin-top: 30px; 
              padding-top: 15px;
              font-size: 10px; 
              color: #999; 
              text-align: center;
              border-top: 1px solid #d1d5db;
            }
            
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
            
            @media print {
              body { padding: 0; }
              table { page-break-inside: avoid; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 College Predictions Report</h1>
            <div class="filter-section">
              <div class="filter-item"><strong>Student Rank:</strong> ${filter.rank}</div>
              <div class="filter-item"><strong>Total Colleges:</strong> ${filteredColleges.length}</div>
              <div class="filter-item"><strong>Category:</strong> ${filter.caste}</div>
              <div class="filter-item"><strong>Gender:</strong> ${filter.gender}</div>
            </div>
            <p style="margin-top: 12px; font-size: 11px; color: #666;">
              <strong>Generated:</strong> ${new Date().toLocaleString()} | 
              <strong>Platform:</strong> EAMCET College Prediction System
            </p>
          </div>

          <table>
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
              ${filteredColleges
                .map(
                  (college, idx) => `
                <tr>
                  <td class="sno">${idx + 1}</td>
                  <td class="college-name">${college.name || 'N/A'}</td>
                  <td class="location">${college.place || 'N/A'}</td>
                  <td class="branch">${college.branch || 'N/A'}</td>
                  <td class="rank">${college.cutoff_rank ? college.cutoff_rank.toLocaleString() : 'N/A'}</td>
                  <td class="fee">₹${college.college_fee ? college.college_fee.toLocaleString() : 'N/A'}</td>
                  <td class="affiliation">${college.affiliated || 'N/A'}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>This is an auto-generated report from the EAMCET College Prediction Platform. For official information, visit the respective college websites.</p>
          </div>
        </body>
      </html>
    `;

    // Create a temporary element
    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `College_Predictions_${new Date().toISOString().split("T")[0]}.pdf`,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              College Predictions
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Rank: <span className="font-bold text-blue-600">{filter.rank}</span> | Category:{" "}
              <span className="font-bold text-blue-600">{filter.caste}</span> | Gender:{" "}
              <span className="font-bold text-blue-600">{filter.gender}</span> | Total: <span className="font-bold text-blue-600">{filteredColleges.length}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold self-end sm:self-auto"
          >
            ×
          </button>
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
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-xs sm:text-sm transition whitespace-nowrap"
          >
            Download as PDF
          </button>
        </div>

        {/* Table - Desktop View */}
        <div className="hidden sm:block overflow-x-auto p-4 sm:p-6" id="colleges-table-pdf">
          {filteredColleges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No colleges found for selected filters</p>
            </div>
          ) : (
            <>
              {/* PDF Header */}
              <div className="mb-4 text-xs text-gray-600 print:block">
                <p className="font-bold">College Predictions Report</p>
                <p>Rank: {filter.rank} | Category: {filter.caste} | Gender: {filter.gender}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>
              
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-blue-50 border-b">
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
                  {filteredColleges.map((college, idx) => (
                    <tr
                      key={`${idx}`}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 font-semibold text-xs sm:text-sm text-center">{idx + 1}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-800 text-xs sm:text-sm">{college.name}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 text-xs sm:text-sm">{college.place}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm">{college.branch}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-center font-bold text-blue-600 text-xs sm:text-sm">
                        {college.cutoff_rank.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-center text-gray-700 text-xs sm:text-sm">
                        {college.college_fee
                          ? `₹${(college.college_fee / 1000).toFixed(0)}K`
                          : "N/A"}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-600 text-xs">{college.affiliated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Card View - Mobile */}
        <div className="sm:hidden p-4 space-y-3" id="colleges-table-pdf">
          {filteredColleges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No colleges found</p>
            </div>
          ) : (
            filteredColleges.map((college, idx) => (
              <div
                key={`${idx}`}
                className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition"
              >
                <div className="font-bold text-sm text-gray-800 mb-2">{college.name}</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-700">S.No:</span> {idx + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Branch:</span> {college.branch}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Location:</span> {college.place}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Affiliation:</span> {college.affiliated}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700">Cutoff Rank:</span>{" "}
                    <span className="font-bold text-blue-600">{college.cutoff_rank.toLocaleString()}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700">Fee:</span>{" "}
                    {college.college_fee ? `₹${college.college_fee.toLocaleString()}` : "N/A"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
