import { useEffect, useState } from "react";
import { api } from "../lib/api";

function AttemptDetails({ email, test_name, onClose }) {
  const [attempts, setAttempts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/admin/student-details/details?email=${encodeURIComponent(email)}&test_name=${encodeURIComponent(test_name)}`)
      .then(res => {
        setAttempts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load attempts");
        setLoading(false);
      });
  }, [email, test_name]);

  if (loading) return <div className="p-2 text-xs">Loading attempts...</div>;
  if (error) return <div className="p-2 text-xs text-red-600">{error}</div>;
  if (!attempts || attempts.length === 0) return <div className="p-2 text-xs">No attempts found.</div>;

  return (
    <div className="bg-gray-50 border rounded-b p-2 text-xs sm:text-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">All Attempts</span>
        <button onClick={onClose} className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300">Close</button>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-1 border">Attempt #</th>
            <th className="p-1 border">Total</th>
            <th className="p-1 border">Maths</th>
            <th className="p-1 border">Physics</th>
            <th className="p-1 border">Chemistry</th>
            <th className="p-1 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((a) => (
            <tr key={a.id}>
              <td className="p-1 border text-center">{a.attempt_number}</td>
              <td className="p-1 border text-center">{a.total_score}</td>
              <td className="p-1 border text-center">{a.maths_score}</td>
              <td className="p-1 border text-center">{a.physics_score}</td>
              <td className="p-1 border text-center">{a.chemistry_score}</td>
              <td className="p-1 border text-center">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
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

  const [expanded, setExpanded] = useState(null); // {email, test_name} or null

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
                <>
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50 cursor-pointer ${expanded && expanded.email === s.email && expanded.test_name === s.test_name ? "bg-blue-50" : ""}`}
                    onClick={() =>
                      expanded && expanded.email === s.email && expanded.test_name === s.test_name
                        ? setExpanded(null)
                        : setExpanded({ email: s.email, test_name: s.test_name })
                    }
                  >
                    <td className="p-2 border break-all max-w-[140px] sm:max-w-xs md:max-w-sm">{s.email}</td>
                    <td className="p-2 border break-all max-w-[100px] sm:max-w-xs md:max-w-sm">{s.test_name}</td>
                    <td className="p-2 border text-center">{s.total_score}</td>
                    <td className="p-2 border text-center">{s.attempts}</td>
                  </tr>
                  {expanded && expanded.email === s.email && expanded.test_name === s.test_name && (
                    <tr>
                      <td colSpan={4} className="p-0 border-t-0">
                        <AttemptDetails email={s.email} test_name={s.test_name} onClose={() => setExpanded(null)} />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
