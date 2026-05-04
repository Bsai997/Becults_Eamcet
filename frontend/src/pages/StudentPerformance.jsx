import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function StudentPerformance() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/student-performance").then(res => {
      setStudents(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = students
    .filter(s =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.test_name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (b.total_score || 0) - (a.total_score || 0));

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">Student Performance</h2>
      <input
        className="mb-4 w-full p-2 border rounded text-sm sm:text-base"
        placeholder="Search by email or test name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border whitespace-nowrap">Email</th>
                <th className="p-2 border whitespace-nowrap">Test</th>
                <th className="p-2 border whitespace-nowrap">Total Score</th>
                <th className="p-2 border whitespace-nowrap">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border break-all max-w-[140px] sm:max-w-xs md:max-w-sm">{s.email}</td>
                  <td className="p-2 border break-all max-w-[100px] sm:max-w-xs md:max-w-sm">{s.test_name}</td>
                  <td className="p-2 border text-center">{s.total_score}</td>
                  <td className="p-2 border text-center">{s.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
