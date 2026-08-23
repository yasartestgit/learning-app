import type { AttemptAnswers, MockExam, ScoreResult } from "./types";

// PRD 02 FR1/acceptance criteria: apply the exam's own marking scheme exactly
// — a wrong answer on a +4/-1/0 exam costs 1 mark, a blank costs 0, matching
// the scheme's data rather than a scheme-specific formula in this function.
export function scoreAttempt(exam: MockExam, answers: AttemptAnswers): ScoreResult {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  let score = 0;

  for (const q of exam.questions) {
    const selected = answers[q.id];
    if (selected === undefined) {
      unanswered++;
      score += exam.marking.unanswered;
    } else if (selected === q.correctIndex) {
      correct++;
      score += exam.marking.correct;
    } else {
      incorrect++;
      score += exam.marking.incorrect;
    }
  }

  return {
    correct,
    incorrect,
    unanswered,
    score,
    maxScore: exam.questions.length * exam.marking.correct,
  };
}
