import { computeStreak } from "@/lib/goals/streaks";
import type { Goal } from "@/lib/goals/types";
import type { QuickReply } from "./types";

export type CoachReply = {
  text: string;
  quickReplies?: QuickReply[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function findMentionedGoal(message: string, goals: Goal[]): Goal | undefined {
  const lower = message.toLowerCase();
  return goals.find((g) => lower.includes(g.title.toLowerCase()));
}

function nextIncompleteMilestone(goal: Goal) {
  return goal.milestones.find((m) => !m.done);
}

// PRD 04 (Coach Chat) FR1: a small set of recognized intents, each grounded
// in the student's actual goal data — never a canned string. FR2: a plan
// change (rescheduling) always surfaces an explicit confirm/decline choice,
// never mutates silently — the caller applies the change only after a
// "reschedule_confirm" quick reply is clicked, this function never mutates.
export function respond(message: string, goals: Goal[]): CoachReply {
  const lower = message.toLowerCase().trim();

  if (goals.length === 0) {
    return {
      text: "You don't have a goal set yet — set one first and I can help you stay on track with it.",
    };
  }

  if (!lower) {
    return { text: "Ask me something — try \"what should I do today\" or \"I'm behind on X\"." };
  }

  if (/\b(behind|late|falling behind|catch up|catching up)\b/.test(lower)) {
    const goal = findMentionedGoal(message, goals) ?? goals[0];
    const next = nextIncompleteMilestone(goal);
    if (!next) {
      return { text: `${goal.title} has every milestone checked off already — nothing to catch up on there.` };
    }
    return {
      text: `Behind on ${goal.title} just means the next milestone matters more, not that the plan's broken. "${next.title}" is next, due ${formatDate(next.dueDate)}. Want me to shift your remaining milestone dates by a few days to make room?`,
      quickReplies: [
        { label: "Yes, shift dates", kind: "reschedule_confirm", goalId: goal.id },
        { label: "No, I'll catch up", kind: "reschedule_decline", goalId: goal.id },
      ],
    };
  }

  if (/\b(what should i (do|study)|what.?s next|today)\b/.test(lower)) {
    const open = goals
      .map((g) => ({ goal: g, next: nextIncompleteMilestone(g) }))
      .filter((x): x is { goal: Goal; next: NonNullable<ReturnType<typeof nextIncompleteMilestone>> } =>
        Boolean(x.next),
      );
    if (open.length === 0) {
      return { text: "Every milestone across every goal is checked off. Nothing pending today." };
    }
    const lines = open.map((x) => `${x.goal.title}: "${x.next.title}" (due ${formatDate(x.next.dueDate)})`);
    return { text: `Here's what's open across your goals:\n${lines.join("\n")}` };
  }

  if (/\b(streak|progress|how am i doing)\b/.test(lower)) {
    const lines = goals.map((g) => {
      const s = computeStreak(g.checkIns);
      return `${g.title}: ${s.current}-day streak (longest ${s.longest})`;
    });
    return { text: lines.join("\n") };
  }

  return {
    text: 'Ask me things like "I\'m behind on <goal>", "what should I do today", or "how\'s my streak" — I can only work with what\'s actually in your goals right now.',
  };
}
