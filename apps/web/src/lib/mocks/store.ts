import type { Attempt } from "./types";

// localStorage-backed for now, same reasoning as src/lib/goals/store.ts:
// async on purpose so a future database-backed swap doesn't touch callers.
const STORAGE_KEY = "goalyst:mockAttempts";

function readAll(): Attempt[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Attempt[]) : [];
  } catch {
    return [];
  }
}

function writeAll(attempts: Attempt[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

export async function listAttempts(): Promise<Attempt[]> {
  return readAll().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function saveAttempt(attempt: Attempt): Promise<void> {
  const attempts = readAll();
  attempts.push(attempt);
  writeAll(attempts);
}
