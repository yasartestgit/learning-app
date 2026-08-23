export type GoalCategory = "exam" | "skill" | "fitness" | "habit";

export type Milestone = {
  id: string;
  title: string;
  dueDate: string; // ISO date, yyyy-mm-dd
  done: boolean;
};

export type Goal = {
  id: string;
  title: string;
  category: GoalCategory;
  targetDate: string; // ISO date, yyyy-mm-dd
  createdAt: string; // ISO datetime
  milestones: Milestone[];
  checkIns: string[]; // ISO dates (yyyy-mm-dd) checked in on, unique
};

export const GOAL_CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: "exam", label: "Exam prep" },
  { value: "skill", label: "Skill" },
  { value: "fitness", label: "Fitness" },
  { value: "habit", label: "Habit" },
];

export const CATEGORY_LABEL: Record<GoalCategory, string> = {
  exam: "Exam prep",
  skill: "Skill",
  fitness: "Fitness",
  habit: "Habit",
};
