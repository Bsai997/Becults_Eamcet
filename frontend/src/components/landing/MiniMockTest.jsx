import React, { useState } from 'react';

export default function MiniMockTest() {
  const questions = [
    {
      id: 1,
      question: 'If sin(θ) = 3/5, then what is cos(θ)?',
      options: ['4/5', '3/4', '5/3', '5/4'],
      correct: 0,
      explanation: 'Using sin²(θ) + cos²(θ) = 1, we get cos(θ) = ±4/5. Since sin(θ) = 3/5, cos(θ) = 4/5'
    },
    {
      id: 2,
      question: 'Solve: x² - 5x + 6 = 0',
      options: ['x = 2, 3', 'x = 1, 6', 'x = 2, 4', 'x = 3, 6'],
      correct: 0,
      explanation: 'Using factorization: (x - 2)(x - 3) = 0, so x = 2 or x = 3'
    },
    {
      id: 3,
      question: 'What is tan(45°)?',
      options: ['1', '0', '√3', '1/√3'],
      correct: 0,
      explanation: 'tan(45°) = 1 because sin(45°) = cos(45°) = 1/√2'
    },
    {
      id: 4,
      question: 'If log(x) = 2, then x = ?',
      options: ['100', '10', '2', '20'],
      correct: 0,
      explanation: 'log(x) = 2 means 10² = x, so x = 100 (using base 10)'
    },
    {
      id: 5,
      question: 'Find the roots of: 2x² - 4x - 6 = 0',
      options: ['x = 3, -1', 'x = 2, -3', 'x = 1, -2', 'x = 4, -1'],
      correct: 0,
      explanation: 'Dividing by 2: x² - 2x - 3 = 0, factoring: (x - 3)(x + 1) = 0, so x = 3 or x = -1'
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: optionIndex
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const totalMarks = questions.length * 20; // Each question worth 20 marks
  const obtainedMarks = score * 20;

  if (showResults) {
    return (
      <div className="py-16 px-4 bg-gradient-to-b from-green-50 to-blue-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Test Complete!</h2>

            {/* Score Card */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl p-8 mb-8">
              <p className="text-lg mb-2">Your Score</p>
              <p className="text-6xl font-bold mb-2">{obtainedMarks}/{totalMarks}</p>
              <p className="text-xl">{Math.round((score / questions.length) * 100)}%</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{score}</p>
                <p className="text-gray-700">Correct</p>
              </div>
              <div className="bg-red-100 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-600">{questions.length - score}</p>
                <p className="text-gray-700">Incorrect</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{score}/{questions.length}</p>
                <p className="text-gray-700">Attempts</p>
              </div>
            </div>

            {/* Show Answers Button */}
            {!showAnswers ? (
              <button
                onClick={() => setShowAnswers(true)}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition mb-4"
              >
                Show Answers
              </button>
            ) : (
              <div className="mt-8 text-left">
                <h3 className="text-2xl font-extrabold mb-6 text-gray-900">Answer Review</h3>
                {questions.map((q, idx) => (
                  <div key={idx} className="mb-6 p-4 border-2 border-gray-200 rounded-lg">
                    <p className="font-bold text-gray-900 mb-2">Question {idx + 1}: {q.question}</p>
                    <p className="text-sm text-gray-600 mb-2">Your Answer: {q.options[selectedAnswers[idx] || 0]}</p>
                    <p className="text-sm text-green-600 font-bold mb-2">Correct Answer: {q.options[q.correct]}</p>
                    <p className="text-sm text-blue-600 italic">{q.explanation}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setShowResults(false);
                setShowAnswers(false);
              }}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition mt-6"
            >
              Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
            Mini Mock Test
          </h2>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Question {currentQuestion + 1}/{questions.length}
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <h3 className="text-xl font-extrabold text-gray-900 mb-6">{q.question}</h3>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                className={`w-full p-4 border-2 rounded-lg text-left font-semibold transition ${
                  selectedAnswers[currentQuestion] === idx
                    ? 'border-green-600 bg-green-50 text-green-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-400'
                }`}
              >
                <span className="mr-3">
                  {selectedAnswers[currentQuestion] === idx ? '✓' : '○'}
                </span>
                {option}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleFinish}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                Finish Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                Next
              </button>
            )}
          </div>

          {/* Question Indicator */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-full font-bold transition ${
                  currentQuestion === idx
                    ? 'bg-green-600 text-white'
                    : selectedAnswers[idx] !== undefined
                    ? 'bg-green-200 text-green-900'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
