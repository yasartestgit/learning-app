"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getMockExam } from "@/lib/mocks/exams";
import { scoreAttempt } from "@/lib/mocks/scoring";
import { saveAttempt } from "@/lib/mocks/store";
import type { AttemptAnswers, ScoreResult } from "@/lib/mocks/types";

type Phase = "intro" | "taking" | "review";

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function MockExamPage() {
  const params = useParams<{ examId: string }>();
  const exam = getMockExam(params.examId);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AttemptAnswers>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const submit = useMemo(
    () => () => {
      if (!exam) return;
      const scored = scoreAttempt(exam, answers);
      setResult(scored);
      setPhase("review");
      saveAttempt({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        examId: exam.id,
        examName: exam.name,
        submittedAt: new Date().toISOString(),
        answers,
        result: scored,
      });
    },
    [exam, answers],
  );

  useEffect(() => {
    if (phase !== "taking") return;
    // setTimeout(fn, 0) here (not a direct call) deliberately: calling
    // setState synchronously in an effect body triggers cascading renders —
    // deferring by a tick avoids that, same reasoning as the tick below.
    if (secondsLeft <= 0) {
      const id = setTimeout(submit, 0);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  if (!exam) {
    return (
      <div className="mock-shell">
        <p>That mock does not exist.</p>
        <Link href="/mocks" className="btn btn-secondary" style={{ marginTop: 16 }}>
          Back to mock tests
        </Link>
      </div>
    );
  }

  function start() {
    setSecondsLeft(exam!.durationMinutes * 60);
    setPhase("taking");
  }

  function selectOption(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  if (phase === "intro") {
    return (
      <div className="mock-shell">
        <h1>{exam.name}</h1>
        <div className="exam-meta" style={{ margin: "16px 0 28px" }}>
          <span>{exam.durationMinutes} minutes</span>
          <span>{exam.questions.length} questions</span>
          <span>
            Marking: +{exam.marking.correct} correct, {exam.marking.incorrect} incorrect,{" "}
            {exam.marking.unanswered} unanswered
          </span>
        </div>
        <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>
          The timer starts the moment you click start, and submits automatically
          when it runs out — same as the real thing.
        </p>
        <button type="button" className="btn btn-primary" onClick={start}>
          Start mock
        </button>
      </div>
    );
  }

  if (phase === "taking") {
    const question = exam.questions[currentIndex];
    const isLast = currentIndex === exam.questions.length - 1;

    return (
      <div className="mock-shell">
        <div className="mock-header">
          <h2 style={{ fontSize: 18 }}>{exam.name}</h2>
          <span className={secondsLeft <= 30 ? "timer low" : "timer"}>
            {formatClock(secondsLeft)}
          </span>
        </div>

        <div className="question-nav">
          {exam.questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              className={
                (i === currentIndex ? "current " : "") +
                (answers[q.id] !== undefined ? "answered" : "")
              }
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to question ${i + 1}`}
              aria-current={i === currentIndex}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <p className="question-text">
          {currentIndex + 1}. {question.text}
        </p>

        <div className="option-list">
          {question.options.map((option, optIndex) => (
            <label
              key={optIndex}
              className={answers[question.id] === optIndex ? "option-row selected" : "option-row"}
            >
              <input
                type="radio"
                name={question.id}
                checked={answers[question.id] === optIndex}
                onChange={() => selectOption(question.id, optIndex)}
              />
              {option}
            </label>
          ))}
        </div>

        <div className="mock-nav-actions">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            Previous
          </button>
          {isLast ? (
            <button type="button" className="btn btn-primary" onClick={submit}>
              Submit
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  // phase === "review"
  return (
    <div className="mock-shell">
      <div className="score-summary">
        <p className="eyebrow">Score</p>
        <p className="score-value">
          {result!.score}/{result!.maxScore}
        </p>
        <div className="score-breakdown">
          <span>{result!.correct} correct</span>
          <span>{result!.incorrect} incorrect</span>
          <span>{result!.unanswered} unanswered</span>
        </div>
      </div>

      <ul className="review-list">
        {exam.questions.map((q) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correctIndex;
          const status = selected === undefined ? "" : isCorrect ? "correct" : "incorrect";
          return (
            <li key={q.id} className={`review-row ${status}`}>
              <p className="review-q">{q.text}</p>
              <div className="review-answers">
                <span className={`your-answer ${status === "correct" ? "right" : status === "incorrect" ? "wrong" : ""}`}>
                  Your answer: {selected === undefined ? "Not answered" : q.options[selected]}
                </span>
                <span>Correct answer: {q.options[q.correctIndex]}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="wizard-actions" style={{ marginTop: 24 }}>
        <Link href="/mocks" className="text-button">
          Back to mock tests
        </Link>
      </div>
    </div>
  );
}
