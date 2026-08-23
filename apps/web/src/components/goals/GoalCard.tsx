"use client";

import type { CSSProperties } from "react";
import type { Goal } from "@/lib/goals/types";
import { CATEGORY_LABEL } from "@/lib/goals/types";

const ACCENTS = ["blue", "violet", "green", "pink", "yellow", "red"] as const;

type GoalCardProps = {
  goal: Goal;
  index: number;
  onToggleMilestone: (milestoneId: string, done: boolean) => void;
  onRescheduleMilestone: (milestoneId: string, dueDate: string) => void;
  onDelete: () => void;
};

function daysUntil(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function GoalCard({
  goal,
  index,
  onToggleMilestone,
  onRescheduleMilestone,
  onDelete,
}: GoalCardProps) {
  const accent = ACCENTS[index % ACCENTS.length];
  const total = goal.milestones.length;
  const done = goal.milestones.filter((m) => m.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const daysLeft = daysUntil(goal.targetDate);

  const accentStyle = { "--accent": `var(--${accent})` } as CSSProperties;

  return (
    <article className="goal-card" style={accentStyle}>
      <div className="goal-card-head">
        <div>
          <p className="eyebrow">{CATEGORY_LABEL[goal.category]}</p>
          <h3>{goal.title}</h3>
        </div>
        <button
          type="button"
          className="text-button"
          onClick={onDelete}
          aria-label={`Delete ${goal.title}`}
        >
          Delete
        </button>
      </div>

      <div className="goal-meta">
        <span>{daysLeft > 0 ? `${daysLeft} days left` : "Target date passed"}</span>
        <span>
          {done}/{total} milestones
        </span>
      </div>

      <div className="progress-bar">
        <span style={{ width: `${percent}%` }} />
      </div>

      <ul className="milestone-list">
        {goal.milestones.map((m) => (
          <li key={m.id} className={m.done ? "milestone done" : "milestone"}>
            <label className="milestone-check">
              <input
                type="checkbox"
                checked={m.done}
                onChange={(e) => onToggleMilestone(m.id, e.target.checked)}
              />
              <span className="milestone-box" aria-hidden="true" />
              <span className="milestone-title">{m.title}</span>
            </label>
            <input
              type="date"
              className="milestone-date"
              value={m.dueDate}
              onChange={(e) => onRescheduleMilestone(m.id, e.target.value)}
              aria-label={`Due date for ${m.title}`}
            />
          </li>
        ))}
      </ul>
    </article>
  );
}
