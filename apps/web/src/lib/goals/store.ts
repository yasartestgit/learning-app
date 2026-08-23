import type { Goal, Milestone } from "./types";

// localStorage-backed for now (no database yet — see docs/prd/00-overview.md).
// Every function here is async on purpose, even though localStorage itself is
// synchronous: swapping this module for a Supabase-backed implementation later
// should be a storage-layer change, not a rewrite of every caller.

const STORAGE_KEY = "goalyst:goals";

function readAll(): Goal[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Backfill checkIns for goals saved before Streak & Habit Log existed.
    type StoredGoal = Omit<Goal, "checkIns"> & { checkIns?: string[] };
    return (parsed as StoredGoal[]).map((g) => ({ ...g, checkIns: g.checkIns ?? [] }));
  } catch {
    return [];
  }
}

function writeAll(goals: Goal[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export async function listGoals(): Promise<Goal[]> {
  return readAll().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function saveGoal(goal: Goal): Promise<void> {
  const goals = readAll();
  goals.push(goal);
  writeAll(goals);
}

export async function deleteGoal(goalId: string): Promise<void> {
  writeAll(readAll().filter((g) => g.id !== goalId));
}

export async function checkIn(goalId: string): Promise<void> {
  const goals = readAll();
  const goal = goals.find((g) => g.id === goalId);
  if (!goal) return;
  const today = new Date().toISOString().slice(0, 10);
  if (!goal.checkIns.includes(today)) {
    goal.checkIns.push(today);
  }
  writeAll(goals);
}

// PRD 04 (Coach Chat) FR2: only ever called after the student explicitly
// confirms a "shift my dates" quick reply — never invoked automatically.
export async function shiftRemainingMilestones(goalId: string, days: number): Promise<void> {
  const goals = readAll();
  const goal = goals.find((g) => g.id === goalId);
  if (!goal) return;
  for (const m of goal.milestones) {
    if (m.done) continue;
    const d = new Date(`${m.dueDate}T00:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + days);
    m.dueDate = d.toISOString().slice(0, 10);
  }
  writeAll(goals);
}

export async function updateMilestone(
  goalId: string,
  milestoneId: string,
  changes: Partial<Pick<Milestone, "done" | "dueDate">>,
): Promise<void> {
  const goals = readAll();
  const goal = goals.find((g) => g.id === goalId);
  const milestone = goal?.milestones.find((m) => m.id === milestoneId);
  if (!goal || !milestone) return;
  Object.assign(milestone, changes);
  writeAll(goals);
}
