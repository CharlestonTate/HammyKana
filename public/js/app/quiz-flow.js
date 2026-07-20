// Running a quiz: starting lessons/Bomb Rush, the Bomb Rush countdown timer,
// grading answers, and wrapping up a finished quiz group
// audio config is really bad here

let bombRushTimerId = null;

function startLesson(groupIndex, lessonIndex) {
  const questions = buildQuestions(state.activeScript, groupIndex, lessonIndex);
  state.quiz = createQuizState(groupIndex, lessonIndex, questions, 'lesson');
  state.activeView = 'quiz';
  render(state);
}

function startBombRush(options) {
  const questions = buildBombRushQuestions(
    { script: options.script, questionType: options.questionType },
    state.progress
  );

  if (questions.length === 0) {
    state.bombRushError = 'Master more kana before starting Bomb Rush!';
    render(state);
    return false;
  }

  const isInfinite = options.seconds === 'infinite';

  state.bombRushError = '';
  state.quiz = createQuizState(null, null, questions, 'bomb_rush');
  state.quiz.timeLimitSeconds = isInfinite ? null : options.seconds;
  state.quiz.remainingSeconds = isInfinite ? 0 : options.seconds;
  state.quiz.countUp = isInfinite;
  state.activeView = 'quiz';
  render(state);
  startBombRushTimer();
  return true;
}

function startBombRushTimer() {
  stopBombRushTimer();
  bombRushTimerId = setInterval(tickBombRushTimer, 1000);
}

function stopBombRushTimer() {
  if (bombRushTimerId) {
    clearInterval(bombRushTimerId);
    bombRushTimerId = null;
  }
}

function tickBombRushTimer() {
  if (!state.quiz || state.quiz.mode !== 'bomb_rush') {
    stopBombRushTimer();
    return;
  }

  if (state.quiz.countUp) {
    state.quiz.remainingSeconds += 1;
    updateBombRushTimerDisplay(state.quiz);
    return;
  }

  state.quiz.remainingSeconds -= 1;

  if (state.quiz.remainingSeconds <= 0) {
    state.quiz.remainingSeconds = 0;
    state.quiz.timeUp = true;
    handleQuizCompletion(state);
    render(state);
    return;
  }

  updateBombRushTimerDisplay(state.quiz);
}

function submitAnswer(appState, question, userAnswer) {
  const isCorrect = checkAnswer(question, userAnswer);

  question.selectedAnswer = userAnswer;
  question.answerStatus = isCorrect ? 'correct' : 'incorrect';

  if (isCorrect) {
    appState.quiz.correctCount += 1;
    playSfx('correct');
    if (window.hammy && typeof hammy.speak === 'function') {
      hammy.speak('positive');
    }
    render(appState);

    if (question.type !== 'word_spelling' && question.type !== 'romaji_to_kana') {
      setTimeout(() => {
        advanceQuiz(appState.quiz);

        if (isQuizComplete(appState.quiz)) {
          handleQuizCompletion(appState);
        }

        render(appState);
      }, 400);
    }
    return;
  }

  playSfx('wrong');
  if (window.hammy && typeof hammy.speak === 'function') {
    hammy.speak('encouragement');
  }

  if (appState.quiz.mode === 'bomb_rush') {
    render(appState);
    return;
  }

  const repeatQuestion = cloneQuizQuestion(question);
  appState.quiz.questions.push(repeatQuestion);
  render(appState);
}

function cloneQuizQuestion(question) {
  return {
    ...question,
    guess: '',
    selectedAnswer: undefined,
    answerStatus: undefined,
    requeued: false
  };
}

function continueAfterIncorrect(state) {
  const quiz = state.quiz;
  const currentQuestion = quiz.questions[quiz.currentIndex];

  currentQuestion.answerStatus = undefined;
  currentQuestion.selectedAnswer = undefined;
  currentQuestion.guess = '';

  advanceQuiz(quiz);

  if (isQuizComplete(quiz)) {
    handleQuizCompletion(state);
  }

  render(state);
}

function continueAfterCorrect(state) {
  const quiz = state.quiz;

  advanceQuiz(quiz);

  if (isQuizComplete(quiz)) {
    handleQuizCompletion(state);
  }

  render(state);
}

function isBombRush(quiz) {
  return quiz && quiz.mode === 'bomb_rush';
}

function handleQuizCompletion(appState) {
  if (isBombRush(appState.quiz)) {
    stopBombRushTimer();
    playSfx('complete');
    state.lessonCompleteCelebrated = false;
    return;
  }

  finishLesson(appState);
}

function finishLesson(appState) {
  const scriptProgress = appState.progress[appState.activeScript];
  const group = scriptProgress.groups[appState.quiz.groupIndex];
  const wasMastered = group.mastered;

  markLessonComplete(
    scriptProgress,
    appState.quiz.groupIndex,
    appState.quiz.lessonIndex
  );
  playSfx('complete');

  if (!wasMastered && group.mastered) {
    // The "finish" sfx plays later, on the path view, in sync with the gold reveal
    // animation (js/ui/path-view.js) - not here on the quiz-complete screen.
    state.justMasteredGroup = {
      script: appState.activeScript,
      groupIndex: appState.quiz.groupIndex
    };
  }

  state.lessonCompleteCelebrated = false;
  persistProgress();
}
