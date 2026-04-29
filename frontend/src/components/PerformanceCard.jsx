import React from "react";

const PerformanceCard = React.memo(function PerformanceCard({ item, onView }) {
  const subjectChips = [
    { label: "Maths", value: item.maths_score, color: "bg-blue-50 text-blue-700 border-blue-100" },
    { label: "Physics", value: item.physics_score, color: "bg-violet-50 text-violet-700 border-violet-100" },
    {
      label: "Chemistry",
      value: item.chemistry_score,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-bold text-slate-900">{item.test_name}</h4>
          <p className="mt-1 text-sm text-slate-600">Attempt {item.attempt_number}</p>
        </div>
        <div className="rounded-xl bg-slate-900 px-3 py-2 text-right text-white">
          <div className="text-xs text-slate-300">Total</div>
          <div className="text-2xl font-bold leading-none">{item.total_score}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {subjectChips.map((chip) => (
          <span
            key={chip.label}
            className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${chip.color}`}
          >
            {chip.label}: {chip.value}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">{new Date(item.attempted_at).toLocaleString()}</p>

      <button
        onClick={() => onView(item)}
        className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800 transition-colors"
      >
        View Detailed Result
      </button>
    </div>
  );
});

export default PerformanceCard;
