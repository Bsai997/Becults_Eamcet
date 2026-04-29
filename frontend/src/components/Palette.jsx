import React from "react";

const Palette = React.memo(function Palette({ questions, currentIndex, answers, reviewMap, onJump }) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {questions.map((q, idx) => {
        const answered = answers[q.id] !== undefined && answers[q.id] !== null;
        const reviewed = reviewMap[q.id];
        let color = "bg-slate-200";
        if (reviewed) color = "bg-purple-400 text-white";
        else if (answered) color = "bg-green-500 text-white";
        else if (idx <= currentIndex) color = "bg-red-400 text-white";

        return (
          <button
            key={q.id}
            onClick={() => onJump(idx)}
            className={`rounded px-2 py-2 text-base font-semibold leading-none ${color}`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
});

export default Palette;
