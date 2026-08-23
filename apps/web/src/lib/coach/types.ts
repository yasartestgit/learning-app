export type ChatRole = "user" | "coach";

export type QuickReplyKind = "reschedule_confirm" | "reschedule_decline";

export type QuickReply = {
  label: string;
  kind: QuickReplyKind;
  goalId: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  quickReplies?: QuickReply[];
};
