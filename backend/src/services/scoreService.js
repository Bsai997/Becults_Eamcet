export const calculateScores = (questionRows, answerMap) => {
  const subjectScores = {
    Maths: 0,
    Physics: 0,
    Chemistry: 0,
  };

  const detailedResults = questionRows.map((question) => {
    const selectedOptionId = answerMap[question.id];
    const selectedOption = question.options.find((option) => option.id === selectedOptionId);
    const correctOption = question.options.find((option) => option.is_correct);
    const isCorrect = selectedOption?.id === correctOption?.id;

    if (isCorrect && subjectScores[question.subject_name] !== undefined) {
      subjectScores[question.subject_name] += 1;
    }

    return {
      question_id: question.id,
      subject: question.subject_name,
      question_text: question.question_text,
      question_image_url: question.question_image_url || null,
      explanation: question.explanation,
      correct_answer: correctOption?.option_text || null,
      correct_option_image_url: correctOption?.option_image_url || null,
      user_answer: selectedOption?.option_text || null,
      user_option_image_url: selectedOption?.option_image_url || null,
      is_correct: isCorrect,
    };
  });

  const total = subjectScores.Maths + subjectScores.Physics + subjectScores.Chemistry;

  return {
    subjectScores,
    total,
    detailedResults,
  };
};
