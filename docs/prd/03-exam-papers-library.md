# PRD — Exam & Papers Library

**Status:** Planned — Term 2
**Depends on:** Database & auth (Supabase); feeds into Mock Test Engine (`02-mock-test-engine.md`)

## Summary

Lets a student browse government/competitive exams by **state** and **category** (e.g. Delhi Police, UP Police, SSC), see eligibility and exam pattern, and load any previous year paper straight into a real timed mock. Scope is explicitly **pattern + previous papers only** — not live vacancy/seat-count tracking (see Non-goals).

## User stories

- As a state-exam aspirant, I want to find exams relevant to my state and category, so I'm not sifting through a NEET-shaped tool that doesn't fit my exam.
- As a student, I want to see an exam's eligibility and pattern before committing to prep for it.
- As a student, I want to practice an actual previous year paper under real exam conditions, not just read it as a PDF.

## Flow

1. Student selects **state** (e.g. Uttar Pradesh) and **category** (e.g. Police) — from the Goal Wizard's exam-prep path, or a standalone "Explore Exams" entry point.
2. Filtered list of matching exams is shown (e.g. "UP Police Constable," "UP SI").
3. Selecting an exam opens a detail page: conducting body, eligibility (age/education), exam pattern (sections, question count, duration, marking scheme), and a list of previous year papers by year.
4. Selecting a previous year paper opens it directly in the Mock Test Engine, timed, with that exam's marking scheme applied.

## Functional requirements

- FR1: Content (exams, patterns, papers, eligibility) MUST be stored as structured data (a curated table), maintained by content edits — not scraped or live-fetched. This keeps accuracy owned by a person (see the subject-matter reviewer role in the plan), not a fragile scraper.
- FR2: A student MUST be able to filter by state AND category simultaneously.
- FR3: Every previous year paper entry MUST carry the exam's marking scheme as structured data so it can be handed to the Mock Test Engine without manual re-entry.
- FR4: Content updates (a new exam added, a paper added) MUST NOT require a code deploy — this is a content/data change, not a feature change.

## Acceptance criteria

- Given a student filters by "Delhi" and "Police," when results load, then only Delhi-based police exams appear — not state police exams from other states.
- Given a student opens a previous year paper and taps "Start mock," when the mock loads, then it runs on the same timer and marking-scheme logic as any other mock in the engine.

## Non-goals (explicit — do not build without a separate PRD)

- **Live vacancy/seat counts or application deadlines.** This requires a continuously-accurate live data source; getting it wrong is a trust-breaking failure (a missed deadline), not a cosmetic bug. Out of scope until there's a plan for a reliable, monitored data pipeline — not a v1 concern.
- Real-time notification push when a new vacancy opens — same reasoning as above.
