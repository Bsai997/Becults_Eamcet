import React from "react";

const QuestionCard = React.memo(function QuestionCard({ question, selectedOption, onSelect }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      {/* Question with text and/or image */}
      <div className="mb-6">
        {question.question_text && (
          <p className="mb-4 text-2xl font-semibold leading-snug">{question.question_text}</p>
        )}
        {question.question_image_url && (
          <img
            src={question.question_image_url}
            alt="Question"
            className="mb-4 max-w-full rounded border"
            loading="lazy"
          />
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex w-full cursor-pointer items-start gap-4 rounded border p-4 hover:bg-slate-50"
          >
            <input
              type="radio"
              name={`q-${question.id}`}
              checked={selectedOption === option.id}
              onChange={() => onSelect(option.id)}
              className="mt-1 h-6 w-6"
            />
            <div className="flex flex-col gap-2">
              {option.option_text && (
                <span className="text-lg font-semibold leading-snug">{option.option_text}</span>
              )}
              {option.option_image_url && (
                <img
                  src={option.option_image_url}
                  alt="Option"
                  className="max-w-xs rounded border"
                  loading="lazy"
                />
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
});

export default QuestionCard;
