import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  const sessionResult = useMemo(() => {
    const raw = sessionStorage.getItem(`result-${attemptId}`);
    return raw ? JSON.parse(raw) : null;
  }, [attemptId]);

  useEffect(() => {
    const load = async () => {
      if (sessionResult) {
        setResult(sessionResult);
        return;
      }
      try {
        const response = await api.get(`/student/result/${attemptId}`);
        setResult(response.data);
      } catch (_error) {
        setResult(null);
      }
    };
    load();
  }, [attemptId, sessionResult]);

  if (!result) {
    return (
      <div className="p-8">
        <p>Unable to load result.</p>
        <button onClick={() => navigate("/student")} className="mt-2 rounded bg-slate-800 px-3 py-2 text-white">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Result</h1>
        <button 
          onClick={() => navigate("/student")} 
          className="rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Maths Score</p>
          <p className="mt-2 text-3xl font-bold text-blue-700">{result.maths_score}</p>
          {/* <p className="mt-2 text-3xl font-bold text-blue-700">{result.maths_score}</p> */}
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Physics Score</p>
          <p className="mt-2 text-3xl font-bold text-violet-700">{result.physics_score}</p>
          {/* <p className="mt-2 text-3xl font-bold text-violet-700">{result.physics_score}</p> */}
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Chemistry Score</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">{result.chemistry_score}</p>
        </div>
        <div className="rounded-xl border bg-slate-900 p-4 text-white shadow-sm">
          <p className="text-sm font-medium text-slate-300">Total Score</p>
          <p className="mt-2 text-3xl font-bold">{result.total_score}</p>
        </div>
      </div>

      <h2 className="mt-6 text-xl font-semibold">Detailed Review</h2>
      <div className="mt-3 space-y-3">
        {result.detailed_results.map((item) => (
          <div key={item.question_id} className="rounded-xl border bg-white p-5 shadow-sm">
            {/* Question with text and/or image */}
            {item.question_text && (
              <p className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl md:text-2xl">
                {item.question_text}
              </p>
            )}
            {item.question_image_url && (
              <img
                src={item.question_image_url}
                alt="Question"
                className="mt-3 max-w-full rounded border"
              />
            )}
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Correct Answer:</p>
                {item.correct_answer && (
                  <span className="text-sm font-semibold text-green-700">{item.correct_answer}</span>
                )}
                {item.correct_option_image_url && (
                  <img
                    src={item.correct_option_image_url}
                    alt="Correct Option"
                    className="mt-2 max-w-xs rounded border"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Your Answer:</p>
                {item.user_answer ? (
                  <>
                    <span className="text-sm font-semibold text-blue-700">{item.user_answer}</span>
                    {item.user_option_image_url && (
                      <img
                        src={item.user_option_image_url}
                        alt="Your Option"
                        className="mt-2 max-w-xs rounded border"
                      />
                    )}
                  </>
                ) : (
                  <span className="text-sm font-semibold text-blue-700">Not Answered</span>
                )}
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-semibold text-amber-800">Explanation</p>
              <p className="mt-1 text-sm text-amber-900"><b>{item.explanation}</b></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
