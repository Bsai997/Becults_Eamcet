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

  const filtered = students.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.test_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Student Performance</h2>
      <input
        className="mb-4 w-full p-2 border rounded"
        placeholder="Search by email or test name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Test</th>
                {/* <th className="p-2 border">Subject Scores</th> */}
                <th className="p-2 border">Total Score</th>
                <th className="p-2 border">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{s.email}</td>
                  <td className="p-2 border">{s.test_name}</td>
                  {/* <td className="p-2 border">
                    {Object.entries(s.subject_scores || {}).map(([sub, score]) => (
                      <div key={sub}><b>{sub}:</b> {score}</div>
                    ))}
                  </td> */}
                  <td className="p-2 border">{s.total_score}</td>
                  <td className="p-2 border">{s.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
