"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MOCK_EXAMS } from "@/lib/mocks/exams";
import { listAttempts } from "@/lib/mocks/store";
import type { Attempt } from "@/lib/mocks/types";

const ACCENTS = ["blue", "violet", "green", "pink", "yellow", "red"] as const;

function formatMarking(marking: { correct: number; incorrect: number; unanswered: number }): string {
  return `+${marking.correct} / ${marking.incorrect} / ${marking.unanswered}`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MocksPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    listAttempts().then(setAttempts);
  }, []);

  return (
    <div className="page-shell">
      <div className="page-head">
        <h1>Mock tests</h1>
      </div>

      <div className="goal-list">
        {MOCK_EXAMS.map((exam, index) => {
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <div
              key={exam.id}
              className="exam-card"
              style={{ ["--accent" as string]: `var(--${accent})` }}
            >
              <div>
                <h3>{exam.name}</h3>
                <div className="exam-meta">
                  <span>{exam.durationMinutes} min</span>
                  <span>{exam.questions.length} questions</span>
                  <span>Marking {formatMarking(exam.marking)}</span>
                </div>
              </div>
              <Link href={`/mocks/${exam.id}`} className="btn btn-primary">
                Start
              </Link>
            </div>
          );
        })}
      </div>

      {attempts.length > 0 && (
        <div className="attempt-history">
          <h2>Past attempts</h2>
          {attempts.map((a) => (
            <div className="attempt-row" key={a.id}>
              <span>{a.examName}</span>
              <span>
                {a.result.score}/{a.result.maxScore} · {formatDateTime(a.submittedAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
