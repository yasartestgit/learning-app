"use client";

import { useEffect, useRef, useState } from "react";
import { respond } from "@/lib/coach/respond";
import type { ChatMessage, QuickReply } from "@/lib/coach/types";
import { listGoals, shiftRemainingMilestones } from "@/lib/goals/store";
import type { Goal } from "@/lib/goals/types";

const SHIFT_DAYS = 3;

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function CoachPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listGoals().then((g) => {
      setGoals(g);
      setMessages([
        {
          id: makeId(),
          role: "coach",
          text: "Hey — ask me anything about your prep, or tell me if you're behind on something.",
        },
      ]);
    });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: makeId(), role: "user", text };
    const reply = respond(text, goals);
    const coachMsg: ChatMessage = {
      id: makeId(),
      role: "coach",
      text: reply.text,
      quickReplies: reply.quickReplies,
    };
    setMessages((prev) => [...prev, userMsg, coachMsg]);
    setInput("");
  }

  async function handleQuickReply(messageId: string, reply: QuickReply) {
    // Clear the quick replies on this message so it can't be answered twice.
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, quickReplies: undefined } : m)));

    if (reply.kind === "reschedule_confirm") {
      await shiftRemainingMilestones(reply.goalId, SHIFT_DAYS);
      setGoals(await listGoals());
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "coach",
          text: `Done — shifted the remaining milestones by ${SHIFT_DAYS} days.`,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "coach", text: "No problem — the plan stays as it is." },
      ]);
    }
  }

  return (
    <div className="page-shell chat-shell">
      <div className="page-head">
        <div>
          <h1>Coach</h1>
          <p className="eyebrow">Rule-based today — free, always</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble-row ${m.role}`}>
            <div className={`chat-bubble ${m.role}`}>
              {m.text.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {m.quickReplies && (
              <div className="chat-quick-replies">
                {m.quickReplies.map((qr, i) => (
                  <button key={i} type="button" onClick={() => handleQuickReply(m.id, qr)}>
                    {qr.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Ask anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button type="button" className="btn btn-primary" onClick={send} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
