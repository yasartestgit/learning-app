"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GoalCard } from "@/components/goals/GoalCard";
import { deleteGoal, listGoals, updateMilestone } from "@/lib/goals/store";
import type { Goal } from "@/lib/goals/types";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listGoals().then((g) => {
      setGoals(g);
      setLoaded(true);
    });
  }, []);

  async function handleToggle(goalId: string, milestoneId: string, done: boolean) {
    await updateMilestone(goalId, milestoneId, { done });
    setGoals(await listGoals());
  }

  async function handleReschedule(goalId: string, milestoneId: string, dueDate: string) {
    await updateMilestone(goalId, milestoneId, { dueDate });
    setGoals(await listGoals());
  }

  async function handleDelete(goalId: string) {
    await deleteGoal(goalId);
    setGoals(await listGoals());
  }

  return (
    <div className="page-shell">
      <div className="page-head">
        <h1>Your goals</h1>
        <Link href="/goals/new" className="btn btn-primary">
          New goal
        </Link>
      </div>

      {loaded && goals.length === 0 && (
        <div className="empty-state">
          <p className="eyebrow">No goals yet</p>
          <p>
            Nothing to track until there is a goal to chase. Set one and get a
            dated plan back in under two minutes.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link href="/goals/new" className="btn btn-primary">
              Set your first goal
            </Link>
          </div>
        </div>
      )}

      <div className="goal-list">
        {goals.map((goal, index) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            index={index}
            onToggleMilestone={(milestoneId, done) => handleToggle(goal.id, milestoneId, done)}
            onRescheduleMilestone={(milestoneId, dueDate) =>
              handleReschedule(goal.id, milestoneId, dueDate)
            }
            onDelete={() => handleDelete(goal.id)}
          />
        ))}
      </div>
    </div>
  );
}
