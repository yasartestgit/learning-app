"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Chip } from "@/components/Chip";
import { saveGoal } from "@/lib/goals/store";
import { generateMilestones } from "@/lib/goals/templates";
import { CATEGORY_LABEL, GOAL_CATEGORIES } from "@/lib/goals/types";
import type { GoalCategory, Milestone } from "@/lib/goals/types";

type Step = 1 | 2 | 3;

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NewGoalPage() {
  const router = useRouter();
  const minDate = useMemo(() => tomorrowISO(), []);

  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<GoalCategory | null>(null);
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [saving, setSaving] = useState(false);

  function pickCategory(value: GoalCategory) {
    setCategory(value);
    setStep(2);
  }

  function goToPreview() {
    if (!category || !title.trim() || !targetDate) return;
    setMilestones(generateMilestones(category, targetDate));
    setStep(3);
  }

  function startOver() {
    setStep(1);
    setCategory(null);
    setTitle("");
    setTargetDate("");
    setMilestones([]);
  }

  async function handleSave() {
    if (!category) return;
    setSaving(true);
    await saveGoal({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      category,
      targetDate,
      createdAt: new Date().toISOString(),
      milestones,
      checkIns: [],
    });
    router.push("/goals");
  }

  const canContinue = Boolean(title.trim() && targetDate);

  return (
    <div className="wizard-shell">
      <div className="wizard-card">
        {step === 1 && (
          <>
            <p className="step-label">Step 1 of 2</p>
            <h2 className="wizard-title">What kind of goal is this?</h2>
            <div className="chip-grid">
              {GOAL_CATEGORIES.map((c) => (
                <Chip
                  key={c.value}
                  label={c.label}
                  selected={category === c.value}
                  onClick={() => pickCategory(c.value)}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="step-label">Step 2 of 2</p>
            <h2 className="wizard-title">Name it, and pick a date</h2>

            <div className="field">
              <label htmlFor="goal-title">Goal</label>
              <input
                id="goal-title"
                type="text"
                placeholder="e.g. Crack NEET"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="goal-date">Target date</label>
              <input
                id="goal-date"
                type="date"
                min={minDate}
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>

            <div className="wizard-actions">
              <button type="button" className="text-button" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!canContinue}
                onClick={goToPreview}
              >
                See the plan
              </button>
            </div>
          </>
        )}

        {step === 3 && category && (
          <>
            <p className="step-label">Plan ready</p>
            <h2 className="wizard-title">{title}</h2>

            <div className="preview-summary">
              <span>{CATEGORY_LABEL[category]}</span>
              <span>Target: {formatDate(targetDate)}</span>
              <span>{milestones.length} milestones</span>
            </div>

            <ul className="preview-milestones">
              {milestones.map((m) => (
                <li key={m.id}>
                  <span>{m.title}</span>
                  <span>{formatDate(m.dueDate)}</span>
                </li>
              ))}
            </ul>

            <div className="wizard-actions">
              <button type="button" className="text-button" onClick={startOver}>
                Start over
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "Saving…" : "Save goal"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
