export type MarkingScheme = {
  correct: number;
  incorrect: number;
  unanswered: number;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
};

export type MockExam = {
  id: string;
  name: string;
  durationMinutes: number;
  marking: MarkingScheme;
  questions: Question[];
};

// questionId -> selected option index. Absent key = unanswered.
export type AttemptAnswers = Record<string, number | undefined>;

export type ScoreResult = {
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
  maxScore: number;
};

export type Attempt = {
  id: string;
  examId: string;
  examName: string;
  submittedAt: string; // ISO datetime
  answers: AttemptAnswers;
  result: ScoreResult;
};
