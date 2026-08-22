# PRD — Goal Wizard

**Status:** Built (Term 1)
**Depends on:** Database & auth (Supabase)

## Summary

Turns any goal — an exam, a skill, a habit — into a dated, category-aware milestone plan in under two minutes. Chat-driven or form-driven entry point into the whole product.

## User stories

- As a new student, I want to describe my goal in plain terms and get a dated plan back, so I don't face a blank page.
- As a returning student, I want to add a second goal without redoing onboarding, so multiple goals (e.g. NEET + a daily habit) can run in parallel.
- As a student who falls behind, I want the wizard's logic reusable from Coach Chat to reshuffle my milestone dates, not just at creation time.

## Flow

1. Student picks a goal category: **Exam prep / Skill / Fitness / Habit**.
2. Student provides a target date.
3. Wizard generates a milestone plan (4 milestones is the current default for exam-prep goals; category determines the milestone template).
4. Plan is saved and immediately visible on the student's dashboard with a 0% progress bar.

## Functional requirements

- FR1: Wizard MUST complete goal creation in ≤2 minutes of user interaction (measured from category selection to plan saved).
- FR2: Milestone templates MUST be category-aware — an exam-prep goal gets syllabus-shaped milestones; a habit goal gets streak-shaped milestones, not the same template reused.
- FR3: A student MUST be able to hold multiple concurrent goals, each with its own milestone plan and progress bar.
- FR4: Milestone dates MUST be editable after creation (feeds Coach Chat's "shift your milestone dates" capability — see `04-coach-chat.md`).

## Acceptance criteria

- Given a student selects "Exam prep" and a date 9 months out, when the wizard completes, then a plan with dated milestones spanning that window is saved and visible without a page reload.
- Given a student already has one goal, when they start the wizard again, then the new goal is created independently and the existing goal's progress is untouched.

## Non-goals

- The wizard does not validate that a target date is realistic for a given syllabus (e.g. NEET in 2 weeks) — no blocking validation in Term 1; consider a soft warning in a later term.
