# PRD — Peer Leaderboard

**Status:** Planned — no committed term yet

## Summary

Optional, opt-in study groups and friendly rank comparison. Thesis: peer pressure outperforms push notifications for sustained engagement.

## User stories

- As a student, I want to compare progress with friends who opted in, so social accountability reinforces my own habit.
- As a student, I do NOT want to be visible on any leaderboard unless I explicitly opt in.

## Functional requirements

- FR1: Participation MUST be opt-in per student — no default visibility of any student's data to another.
- FR2: Leaderboard groups MUST be small and student-formed (e.g. invite-based study groups), not a single global ranking, to keep comparison meaningful rather than discouraging.
- FR3: Ranking metric(s) TBD — likely streak length and/or mocks completed; needs a decision before implementation starts.

## Open questions (resolve before building)

- What happens when a student leaves a group — does history stay visible to remaining members?
- Does this need moderation/reporting given it's a social feature with minors as likely users?

This PRD is intentionally thin — flesh out before this leaves "Planned" status.
