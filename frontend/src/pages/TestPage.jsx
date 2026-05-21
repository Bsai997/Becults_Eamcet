import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Palette from "../components/Palette";
import { api } from "../lib/api";

export default function TestPage() {
  const { testId, attemptId } = useParams();
  const navigate = useNavigate();
  const [testInfo, setTestInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewMap, setReviewMap] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const load = async () => {
      const response = await api.get(`/student/test/${testId}`);
      setQuestions(response.data.questions);
      setTestInfo(response.data.test);
      setSecondsLeft(response.data.test.duration * 60);
    };
    load();
  }, [testId]);

  useEffect(() => {
    // Preserve attempted answers after refresh by loading from DB.
    const loadAnswers = async () => {
      if (!attemptId || !questions.length) return;

      const response = await api.get(`/student/attempt-answers/${attemptId}`);
      const map = Object.fromEntries(
        (response.data.answers || []).map((row) => [row.question_id, row.selected_option_id])
      );
      setAnswers(map);

      // Jump to the last question that has a saved row in DB.
      const lastIdx = questions.reduce((acc, q, idx) => (q.id in map ? idx : acc), 0);
      setIndex(lastIdx);
    };

    loadAnswers().catch(() => {
      // If loading fails, we keep the default empty state.
    });
  }, [attemptId, questions.length]);

  useEffect(() => {
    if (secondsLeft <= 0 || !questions.length) {
      if (questions.length && secondsLeft <= 0) submitTest();
      return;
    }
    const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, questions.length]);

  const currentQuestion = useMemo(() => questions[index], [questions, index]);

  const saveCurrentAnswer = async () => {
    if (!currentQuestion) return;
    await api.post("/student/save-answer", {
      attemptId,
      questionId: currentQuestion.id,
      selectedOptionId: answers[currentQuestion.id] || null,
    });
  };

  const saveAndNext = async () => {
    if (!currentQuestion) return;
    await saveCurrentAnswer();
    setIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const markForReview = async () => {
    if (!currentQuestion) return;
    await saveCurrentAnswer();
    setReviewMap((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }));
  };

  const submitTest = async () => {
    await Promise.all(
      questions.map((question) =>
        api.post("/student/save-answer", {
          attemptId,
          questionId: question.id,
          selectedOptionId: answers[question.id] || null,
        })
      )
    );
    const response = await api.post("/student/submit-test", { attemptId, testId });
    sessionStorage.setItem(`result-${attemptId}`, JSON.stringify(response.data));
    navigate(`/result/${attemptId}`);
  };

  if (!currentQuestion || !testInfo) return <div className="p-8">Loading test...</div>;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-6 lg:grid-cols-[2fr_1fr]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{testInfo.name} - Question {index + 1}</h2>
          <div className="rounded bg-slate-900 px-4 py-2 text-white">
            Time Left: {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:{String(secondsLeft % 60).padStart(2, "0")}
          </div>
        </div>
        <QuestionCard
          question={currentQuestion}
          selectedOption={answers[currentQuestion.id]}
          onSelect={(optionId) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setIndex((prev) => Math.max(prev - 1, 0))} className="rounded bg-slate-200 px-3 py-2">
            Previous
          </button>
          <button
            onClick={saveAndNext}
            className="rounded bg-slate-800 px-3 py-2 text-white"
          >
            Save and Next
          </button>
          <button
            onClick={markForReview}
            className="rounded bg-purple-600 px-3 py-2 text-white"
          >
            Mark for Review
          </button>
          <button onClick={submitTest} className="rounded bg-emerald-600 px-3 py-2 text-white">
            Submit Test
          </button>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <h3 className="mb-2 font-semibold">Question Palette</h3>
        <Palette
          questions={questions}
          currentIndex={index}
          answers={answers}
          reviewMap={reviewMap}
          onJump={setIndex}
        />
      </div>
    </div>
  );
}
