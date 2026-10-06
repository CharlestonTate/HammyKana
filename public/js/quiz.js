// Small, reusable helpers for reading/advancing a quiz's current state.

function checkAnswer(question, userAnswer) {
  return userAnswer === question.answer;
}

function getCurrentQuestion(quizState) {
  return quizState.questions[quizState.currentIndex];
}

function isQuizComplete(quizState) {
  return quizState.currentIndex >= quizState.questions.length || !!quizState.timeUp;
}

function advanceQuiz(quizState) {
  quizState.currentIndex += 1;

  // Infinite Bomb Rush never "completes" - once the pool runs out, reshuffle and loop.
  if (quizState.mode === 'bomb_rush' && quizState.countUp && quizState.currentIndex >= quizState.questions.length) {
    quizState.currentIndex = 0;
    quizState.questions = shuffleArray(quizState.questions);
  }
}

function getQuizProgress(quizState) {
  return {
    current: Math.min(quizState.currentIndex + 1, quizState.questions.length),
    total: quizState.questions.length
  };
}

function createQuizState(groupIndex, lessonIndex, questions, mode = 'lesson') {
  return {
    groupIndex,
    lessonIndex,
    questions,
    currentIndex: 0,
    mode,
    correctCount: 0,
    timeUp: false
  };
}
