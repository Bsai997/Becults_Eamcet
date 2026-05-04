import { useState } from "react";
import JSONInput from "../components/JSONInput";
import PreviewPanel from "../components/PreviewPanel";
import { api } from "../lib/api";
import { publishJsonSchema } from "../types/schemas";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [jsonText, setJsonText] = useState("");
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  // Helper function to detect if string is a URL
  const isUrl = (str) => {
    if (!str || typeof str !== "string") return false;
    // Check if it looks like a URL (starts with http:// or https://)
    return /^https?:\/\/.+/.test(str.trim());
  };

  // Helper function to clean URL (remove trailing ?, extra spaces, etc)
  const cleanUrl = (url) => {
    if (!url) return null;
    return url.trim().replace(/\?$/, ""); // Remove trailing ?
  };

  const normalizeParsedJson = (raw) => {
    const duration = raw?.duration ?? raw?.duration_minutes;
    const normalizeSubjectName = (name) => {
      const n = String(name || "").trim().toLowerCase();
      if (n === "maths") return "Maths";
      if (n === "physics") return "Physics";
      if (n === "chemistry") return "Chemistry";
      return name;
    };

    return {
      test_name: raw?.test_name,
      duration,
      subjects: (raw?.subjects || []).map((subject) => ({
        name: normalizeSubjectName(subject?.name),
        questions: (subject?.questions || []).map((question) => {
          const questionText = question?.question_text ?? "";
          const questionImageUrl = question?.question_image_url;

          // If question_text is a URL, move it to question_image_url
          const isQuestionTextUrl = isUrl(questionText);
          return {
            question_text: isQuestionTextUrl ? "" : questionText,
            question_image_url: isQuestionTextUrl ? cleanUrl(questionText) : (questionImageUrl ? cleanUrl(questionImageUrl) : undefined),
            explanation: question?.explanation,
            options: (question?.options || []).map((option) => {
              const optionText = option?.text ?? option?.option_text ?? "";
              const optionImageUrl = option?.image_url ?? option?.option_image_url;

              // If option_text is a URL, move it to image_url
              const isOptionTextUrl = isUrl(optionText);
              return {
                text: isOptionTextUrl ? "" : optionText,
                image_url: isOptionTextUrl ? cleanUrl(optionText) : (optionImageUrl ? cleanUrl(optionImageUrl) : undefined),
                is_correct: option?.is_correct,
              };
            }),
          };
        }),
      })),
    };
  };

  const handleParse = async () => {
    setMessage("");
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const parsedText = JSON.parse(jsonText);
      const normalized = normalizeParsedJson(parsedText);
      const validated = publishJsonSchema.safeParse(normalized);
      if (!validated.success) {
        setError(validated.error.issues[0].message);
        setPreview(null);
        return;
      }
      const response = await api.post("/admin/parse-json", validated.data);
      setPreview(response.data.preview);
      setMessage("JSON parsed successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid JSON payload");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!preview) return;
    setLoading(true);
    setError("");
    setMessage("");
    setSuccess("");
    try {
      const response = await api.post("/admin/publish-test", preview);
      setSuccess(response.data.message || "Test published successfully!");
      setPreview(null);
      setJsonText("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to publish test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-800 drop-shadow mb-2 sm:mb-0">BECULTS.EAMCET</h1>
        <div className="flex gap-2 w-full sm:w-auto sm:justify-end">
          <button
            onClick={() => window.location.href = "/admin/student-performance"}
            className="rounded bg-blue-700 px-2 py-2 sm:px-4 sm:py-2 text-white hover:bg-blue-800 transition text-xs sm:text-base w-full sm:w-auto"
            style={{ minWidth: 0 }}
          >
            Student Performance
          </button>
          <button onClick={logout} className="rounded bg-slate-800 px-2 py-2 sm:px-4 sm:py-2 text-white hover:bg-slate-900 transition text-xs sm:text-base w-full sm:w-auto">Logout</button>
        </div>
      </div>
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-50 p-3 text-sm text-red-700 animate-pulse">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded border border-green-400 bg-green-50 p-3 text-sm text-green-800 animate-fade-in">
          <span className="font-bold">Success:</span> {success}
        </div>
      )}
      {message && !error && !success && (
        <div className="mb-4 rounded border border-blue-300 bg-blue-50 p-3 text-sm text-blue-900">
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <JSONInput value={jsonText} onChange={setJsonText} onParse={handleParse} loading={loading} error={error} />
        <PreviewPanel preview={preview} onPublish={handlePublish} loading={loading} />
      </div>
    </div>
  );
}
