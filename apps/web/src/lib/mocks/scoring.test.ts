import { describe, expect, it } from "vitest";
import { scoreAttempt } from "./scoring";
import { getMockExam } from "./exams";

describe("scoreAttempt", () => {
  it("applies negative marking exactly as the exam's scheme states", () => {
    const exam = getMockExam("neet-physics-sample")!;
    // q1 correct, q2 wrong, q3 unanswered, q4 correct, q5 wrong
    const result = scoreAttempt(exam, {
      q1: exam.questions[0].correctIndex,
      q2: (exam.questions[1].correctIndex + 1) % exam.questions[1].options.length,
      q4: exam.questions[3].correctIndex,
      q5: (exam.questions[4].correctIndex + 1) % exam.questions[4].options.length,
    });

    expect(result.correct).toBe(2);
    expect(result.incorrect).toBe(2);
    expect(result.unanswered).toBe(1);
    // 2*4 + 2*(-1) + 1*0 = 6
    expect(result.score).toBe(6);
    expect(result.maxScore).toBe(20);
  });

  it("applies a no-negative-marking scheme with zero penalty for wrong answers", () => {
    const exam = getMockExam("up-police-constable-sample")!;
    const result = scoreAttempt(exam, {
      q1: (exam.questions[0].correctIndex + 1) % exam.questions[0].options.length,
    });

    expect(result.incorrect).toBe(1);
    expect(result.score).toBe(0);
  });

  it("scores every question correct as the maximum score", () => {
    const exam = getMockExam("neet-physics-sample")!;
    const answers = Object.fromEntries(exam.questions.map((q) => [q.id, q.correctIndex]));
    const result = scoreAttempt(exam, answers);

    expect(result.score).toBe(result.maxScore);
    expect(result.incorrect).toBe(0);
    expect(result.unanswered).toBe(0);
  });

  it("treats a fully blank attempt as all unanswered", () => {
    const exam = getMockExam("up-police-constable-sample")!;
    const result = scoreAttempt(exam, {});

    expect(result.unanswered).toBe(exam.questions.length);
    expect(result.score).toBe(0);
  });
});
