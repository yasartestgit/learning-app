import { describe, expect, it } from "vitest";
import { generateMilestones } from "./templates";

describe("generateMilestones", () => {
  it("returns one milestone per template entry, in ascending date order", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const milestones = generateMilestones("exam", "2026-09-01", start);

    expect(milestones).toHaveLength(4);
    for (let i = 1; i < milestones.length; i++) {
      expect(milestones[i].dueDate >= milestones[i - 1].dueDate).toBe(true);
    }
  });

  it("spreads milestones between the start date and the target date", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const milestones = generateMilestones("habit", "2026-01-29", start);

    expect(milestones[0].dueDate > "2026-01-01").toBe(true);
    expect(milestones[milestones.length - 1].dueDate <= "2026-01-29").toBe(true);
  });

  it("uses a distinct template per category", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const exam = generateMilestones("exam", "2026-06-01", start);
    const skill = generateMilestones("skill", "2026-06-01", start);

    expect(exam.map((m) => m.title)).not.toEqual(skill.map((m) => m.title));
  });

  it("never produces a target date before the start date", () => {
    const start = new Date("2026-06-01T00:00:00.000Z");
    const milestones = generateMilestones("fitness", "2026-01-01", start);

    for (const m of milestones) {
      expect(m.dueDate >= "2026-06-01").toBe(true);
    }
  });
});
