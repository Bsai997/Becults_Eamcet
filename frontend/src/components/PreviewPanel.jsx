export default function PreviewPanel({ preview, onPublish, loading }) {
  if (!preview) return null;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold">Preview: {preview.test_name}</h3>
      <p className="text-sm text-slate-600">Duration: {preview.duration} minutes</p>
      {preview.subjects.map((subject) => (
        <div key={subject.name} className="mt-4">
          <h4 className="font-semibold">{subject.name}</h4>
          {subject.questions.map((question, idx) => (
            <div key={`${subject.name}-${idx}`} className="mt-2 rounded border p-3 bg-slate-50">
              {/* Question text and image */}
              {question.question_text && (
                <p className="font-medium mb-2">{question.question_text}</p>
              )}
              {question.question_image_url && (
                <img
                  src={question.question_image_url}
                  alt="Question"
                  className="mb-3 max-w-full max-h-32 rounded"
                />
              )}
              
              {/* Options */}
              {question.options.map((option, optionIdx) => (
                <div key={optionIdx} className="mb-2 text-sm">
                  <p
                    className={option.is_correct ? "text-green-700 font-medium" : "text-slate-700"}
                  >
                    {option.text && `- ${option.text}`}
                    {option.is_correct ? " (Correct)" : ""}
                  </p>
                  {option.image_url && (
                    <img
                      src={option.image_url}
                      alt="Option"
                      className="mt-1 max-w-full max-h-24 rounded"
                    />
                  )}
                </div>
              ))}
              <p className="mt-2 text-xs text-slate-500">Explanation: {question.explanation}</p>
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={onPublish}
        disabled={loading}
        className="mt-4 rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
      >
        Publish Test
      </button>
    </div>
  );
}
