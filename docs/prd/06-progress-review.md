# PRD — Progress & Review

**Status:** Expanding (Term 1 base built, Term 2 adds weekly recap depth)

## Summary

One glance at what's on pace and what's slipping, across every goal, plus a weekly recap of the last seven days — the "Sunday review" moment from the daily timetable.

## User stories

- As a student, I want to see at a glance which goals are on pace and which are slipping, without digging into each one.
- As a student, I want a weekly recap every Sunday, so I can make one adjustment before Monday instead of drifting for another week.

## Functional requirements

- FR1: Dashboard MUST show a per-goal progress indicator (percentage complete against milestone plan) visible without opening the goal.
- FR2: A weekly recap MUST surface: mocks completed, streak status, and milestones due vs. completed, for the trailing 7 days.
- FR3: Recap MUST propose at most one concrete adjustment (e.g. "shift milestone X by 3 days") rather than a wall of stats with no recommendation.

## Acceptance criteria

- Given a student has a goal that's fallen behind its milestone schedule, when they view the dashboard, then that goal is visually distinguishable from on-pace goals (not just a number buried in a list).
- Given it's the student's weekly recap day, when they open the app, then the recap is surfaced proactively, not something they have to seek out.
