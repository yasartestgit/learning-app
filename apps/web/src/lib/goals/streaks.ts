export type Streak = {
  current: number;
  longest: number;
  checkedInToday: boolean;
};

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(iso: string, delta: number): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return toISODate(d);
}

/**
 * PRD 05 (Streak & Habit Log) FR2/FR3: a streak that's still "alive" because
 * yesterday was checked in (today just hasn't happened yet) is NOT the same
 * as a broken streak — only count a streak as broken once a day is actually
 * skipped, not the moment today's check-in hasn't happened yet.
 */
export function computeStreak(checkIns: string[], today: Date = new Date()): Streak {
  const set = new Set(checkIns);
  const todayISO = toISODate(today);
  const yesterdayISO = addDays(todayISO, -1);

  let current = 0;
  const anchor = set.has(todayISO) ? todayISO : set.has(yesterdayISO) ? yesterdayISO : null;
  if (anchor) {
    let cursor = anchor;
    while (set.has(cursor)) {
      current++;
      cursor = addDays(cursor, -1);
    }
  }

  const sorted = [...set].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }

  return { current, longest, checkedInToday: set.has(todayISO) };
}
