function checkAnswer(question, userAnswer) {
  return userAnswer === question.answer;
}

function getCurrentQuestion(quizState) {
  return quizState.questions[quizState.currentIndex];
}

function isQuizComplete(quizState) {
  return quizState.currentIndex >= quizState.questions.length;
}

function advanceQuiz(quizState) {
  quizState.currentIndex += 1;
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
    correctCount: 0
  };
}
