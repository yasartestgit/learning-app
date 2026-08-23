import { describe, expect, it } from "vitest";
import { respond } from "./respond";
import type { Goal } from "@/lib/goals/types";

function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: "g1",
    title: "Crack NEET",
    category: "exam",
    targetDate: "2026-12-01",
    createdAt: "2026-01-01T00:00:00.000Z",
    checkIns: [],
    milestones: [
      { id: "m1", title: "Cover the full syllabus once", dueDate: "2026-03-01", done: true },
      { id: "m2", title: "Complete two full mock tests", dueDate: "2026-06-01", done: false },
      { id: "m3", title: "Revise every weak topic", dueDate: "2026-09-01", done: false },
    ],
    ...overrides,
  };
}

describe("respond", () => {
  it("asks the student to set a goal first when there are none", () => {
    const reply = respond("I'm behind", []);
    expect(reply.text).toMatch(/don't have a goal/i);
    expect(reply.quickReplies).toBeUndefined();
  });

  it("grounds a 'behind' reply in the goal's actual next milestone, with a confirm/decline choice", () => {
    const goal = makeGoal();
    const reply = respond("I'm behind on Crack NEET", [goal]);

    expect(reply.text).toContain("Crack NEET");
    expect(reply.text).toContain("Complete two full mock tests");
    expect(reply.quickReplies).toHaveLength(2);
    expect(reply.quickReplies?.[0]).toMatchObject({ kind: "reschedule_confirm", goalId: "g1" });
    expect(reply.quickReplies?.[1]).toMatchObject({ kind: "reschedule_decline", goalId: "g1" });
  });

  it("defaults to the only goal when none is named in the message", () => {
    const goal = makeGoal();
    const reply = respond("I'm falling behind, what now", [goal]);
    expect(reply.quickReplies?.[0].goalId).toBe("g1");
  });

  it("says there's nothing to catch up on when every milestone is already done", () => {
    const goal = makeGoal({
      milestones: [{ id: "m1", title: "Only step", dueDate: "2026-03-01", done: true }],
    });
    const reply = respond("I'm behind on Crack NEET", [goal]);
    expect(reply.text).toMatch(/nothing to catch up on/i);
    expect(reply.quickReplies).toBeUndefined();
  });

  it("lists the next open milestone per goal for a 'what should I do today' question", () => {
    const goalA = makeGoal({ id: "a", title: "Crack NEET" });
    const goalB = makeGoal({
      id: "b",
      title: "Learn Guitar",
      milestones: [{ id: "x", title: "Learn the fundamentals", dueDate: "2026-04-01", done: false }],
    });
    const reply = respond("what should I do today", [goalA, goalB]);
    expect(reply.text).toContain("Crack NEET");
    expect(reply.text).toContain("Learn Guitar");
    expect(reply.text).toContain("Learn the fundamentals");
  });

  it("summarizes streaks per goal for a progress question", () => {
    const goal = makeGoal({ checkIns: [] });
    const reply = respond("how's my streak", [goal]);
    expect(reply.text).toContain("Crack NEET");
    expect(reply.text).toMatch(/\d+-day streak/);
  });

  it("falls back to a specific help prompt for an unrecognized message", () => {
    const reply = respond("hello there", [makeGoal()]);
    expect(reply.text).toMatch(/ask me things like/i);
  });
});
