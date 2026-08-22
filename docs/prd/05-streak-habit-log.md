# PRD — Streak & Habit Log

**Status:** Built (Term 1)

## Summary

Daily check-ins per goal, with longest-streak tracking across every goal a student holds at once. Deliberately no guilt-trip copy — a missed day is a fact, not a failure narrative.

## User stories

- As a student, I want a thirty-second evening check-in, so logging doesn't become its own chore.
- As a student with multiple goals, I want to see streaks per goal, so a strong habit streak isn't hidden by a struggling exam-prep streak or vice versa.

## Functional requirements

- FR1: Check-in MUST be completable in a single interaction (no multi-step form) — this is the "thirty-second log" from the daily timetable in the plan.
- FR2: Streak count MUST be tracked per goal, plus a cross-goal "longest streak" figure.
- FR3: Copy shown on a missed/broken streak MUST be neutral, not punitive — no guilt-based messaging.

## Acceptance criteria

- Given a student has two active goals, when they check in on one, then only that goal's streak increments — the other goal's streak is unaffected.
- Given a student misses a day, when they next open the app, then the streak resets without shaming copy, and the option to check in today is immediately available.

## Success metric tie-in

"Goals with a 7-day streak ≥25%" (from `00-overview.md`) is the primary signal this feature is driving real habit formation, not just decorative gamification.
