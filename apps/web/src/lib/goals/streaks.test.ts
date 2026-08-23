import { describe, expect, it } from "vitest";
import { computeStreak } from "./streaks";

const TODAY = new Date("2026-06-10T12:00:00.000Z");

describe("computeStreak", () => {
  it("counts a streak checked in today", () => {
    const streak = computeStreak(["2026-06-08", "2026-06-09", "2026-06-10"], TODAY);
    expect(streak.current).toBe(3);
    expect(streak.checkedInToday).toBe(true);
  });

  it("keeps yesterday's streak alive if today just hasn't happened yet", () => {
    const streak = computeStreak(["2026-06-08", "2026-06-09"], TODAY);
    expect(streak.current).toBe(2);
    expect(streak.checkedInToday).toBe(false);
  });

  it("resets to zero once a day is actually skipped, not just today", () => {
    // last check-in was two days ago — yesterday was skipped
    const streak = computeStreak(["2026-06-07", "2026-06-08"], TODAY);
    expect(streak.current).toBe(0);
  });

  it("tracks the longest streak independently of the current one", () => {
    // a 4-day streak earlier in the month, then a gap, then today only
    const streak = computeStreak(
      ["2026-06-01", "2026-06-02", "2026-06-03", "2026-06-04", "2026-06-10"],
      TODAY,
    );
    expect(streak.longest).toBe(4);
    expect(streak.current).toBe(1);
  });

  it("returns zero for a goal with no check-ins at all", () => {
    const streak = computeStreak([], TODAY);
    expect(streak.current).toBe(0);
    expect(streak.longest).toBe(0);
    expect(streak.checkedInToday).toBe(false);
  });

  it("ignores duplicate check-in dates", () => {
    const streak = computeStreak(["2026-06-10", "2026-06-10", "2026-06-09"], TODAY);
    expect(streak.current).toBe(2);
  });
});
