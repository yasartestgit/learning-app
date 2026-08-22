# PRD — Mock Test Engine

**Status:** Built (Term 1); wider exam banks in Term 2
**Depends on:** Exam & Papers Library (`03-exam-papers-library.md`) for question content in Term 2+

## Summary

Timed practice tests that replicate the real exam's marking scheme, followed by a full right/wrong review. This is what makes exam day not the first time the pressure feels real.

## User stories

- As an exam-prep student, I want a mock timed exactly like the real thing, so I build pacing instinct before the actual exam.
- As a student, I want negative marking applied exactly as my exam applies it, so my mock score is a trustworthy signal, not an approximation.
- As a student, I want a full review after submitting, so I know exactly which questions I got wrong and why.

## Functional requirements

- FR1: Engine MUST support per-exam marking schemes as data, not hardcoded logic — e.g. NEET's +4/−1/0, a state police exam's own scheme. Adding a new exam's scheme must not require a code change once the Exam & Papers Library (Term 2) exists.
- FR2: A mock MUST run on a countdown timer matching the real exam's duration; submission is forced when time expires.
- FR3: On submission, the engine MUST generate a review screen showing every question, the student's answer, the correct answer, and the marks awarded/deducted.
- FR4: Mock attempts MUST be stored per student so "mocks completed" can be measured against the Term 2 success metric (≥2/active user/month).

## Acceptance criteria

- Given a student starts a NEET mock, when they answer a question wrong, then −1 is applied on scoring; when they leave it blank, then 0 is applied — matching the stated scheme exactly.
- Given the timer reaches zero, when the student has unanswered questions, then the mock auto-submits with those questions scored as blank.

## Term 2 change

Once the Exam & Papers Library ships, a previous year paper selected from the library loads directly into this engine — same timer and marking-scheme logic, sourced from library content instead of a fixed internal question set.
