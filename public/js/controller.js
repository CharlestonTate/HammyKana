// Lets Space/Enter advance a quiz after an answer, instead of requiring a mouse click.

function isContinueKey(event) {
    return event.key === ' ' || event.key === 'Enter';
}

function handleQuizContinueKey(event) {
  if (state.activeView !== 'quiz' || !state.quiz || state.showQuitConfirm) {
    return;
  }

  if (!isContinueKey(event)) {
    return;
  }

  const question = getCurrentQuestion(state.quiz);

  if (!question || !question.answerStatus) {
    return;
  }

  event.preventDefault();

  if (question.answerStatus === 'correct') {
    if (isTypedQuestion(question)) {
      continueAfterCorrect(state);
    }
    return;
  }

  continueAfterIncorrect(state);
}
