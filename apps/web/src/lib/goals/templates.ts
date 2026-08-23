import type { GoalCategory, Milestone } from "./types";

// PRD 01 (Goal Wizard) FR2: category-aware templates, not one template reused
// everywhere. Matches the milestone set shown in the product plan's mockup
// for "exam" — keep that one in sync if it ever changes.
const MILESTONE_TEMPLATES: Record<GoalCategory, string[]> = {
  exam: [
    "Cover the full syllabus once",
    "Complete two full mock tests",
    "Revise every weak topic",
    "Final revision week",
  ],
  skill: [
    "Learn the fundamentals",
    "Build a small practice project",
    "Get feedback from someone ahead of you",
    "Build something real and share it",
  ],
  fitness: [
    "Establish a consistent routine",
    "Hit your first real milestone",
    "Push past a plateau",
    "Reach your target",
  ],
  habit: [
    "Complete your first 7-day streak",
    "Complete your first 30-day streak",
    "Handle a missed day without quitting",
    "Make it automatic",
  ],
};

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function makeMilestoneId(index: number): string {
  return `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Spreads a category's milestone template evenly between startDate and
 * targetDate. If targetDate is before startDate, every milestone collapses
 * onto startDate rather than producing a nonsensical descending plan.
 */
export function generateMilestones(
  category: GoalCategory,
  targetDate: string,
  startDate: Date = new Date(),
): Milestone[] {
  const titles = MILESTONE_TEMPLATES[category];
  const start = startDate.getTime();
  const end = new Date(targetDate).getTime();
  const span = Math.max(end - start, 0);
  const step = span / titles.length;

  return titles.map((title, index) => ({
    id: makeMilestoneId(index),
    title,
    dueDate: toISODate(new Date(start + step * (index + 1))),
    done: false,
  }));
}
