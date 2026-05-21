import React from "react";

const TestCard = React.memo(function TestCard({ test, onAction }) {
  const actionLabel =
    test.status === "Not Started" ? "Start Test" : test.status === "In Progress" ? "Resume Test" : "Retake Test";

  const statusPill =
    test.status === "Not Started"
      ? "bg-slate-100 text-slate-700"
      : test.status === "In Progress"
        ? "bg-indigo-100 text-indigo-700"
        : "bg-emerald-100 text-emerald-700";

  const actionBtn =
    actionLabel === "Start Test"
      ? "bg-blue-600 hover:bg-blue-700"
      : actionLabel === "Resume Test"
        ? "bg-indigo-600 hover:bg-indigo-700"
        : "bg-emerald-600 hover:bg-emerald-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{test.test_name}</h3>
          <div className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusPill}`}>
            {test.status}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">Duration</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{test.duration} min</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">Total Questions</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{test.total_questions}</p>
        </div>
      </div>

      <button
        onClick={() => onAction(test, actionLabel)}
        className={`mt-5 rounded-xl px-4 py-2 text-white font-medium text-sm transition-colors ${actionBtn}`}
      >
        {actionLabel}
      </button>
    </div>
  );
});

export default TestCard;
