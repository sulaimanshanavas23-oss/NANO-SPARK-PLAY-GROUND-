"use client";

import { useState } from "react";
import { Check, Copy, Mail, Send } from "lucide-react";
import { buttonClass } from "@/components/shared/button";
import { cn } from "@/src/lib/utils";

const feedbackTopics = [
  "Lab experience",
  "A tool or platform",
  "The 3D campus",
  "Quiz generator",
  "Something is broken",
  "An idea to build",
];

export function MessageForm({
  mode = "feedback",
}: {
  mode?: "feedback" | "contact";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(feedbackTopics[0]);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function compose() {
    const subject = `${mode === "feedback" ? "Feedback" : "Message"} · ${topic}`;
    const body = [
      `Name: ${name || "Not provided"}`,
      `Email: ${email || "Not provided"}`,
      `Topic: ${topic}`,
      "",
      message,
    ].join("\n");
    return { subject, body };
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (message.trim().length < 12) {
      setError("Please add a little more detail (at least 12 characters).");
      return;
    }
    setError(null);
    const { subject, body } = compose();
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function copy() {
    const { subject, body } = compose();
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError("Clipboard access was blocked — select the text and copy it.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-card sm:p-7"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/70">
            Your name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Optional"
            className="mt-1.5 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-[13px] outline-none transition-colors placeholder:text-ink-muted/40 focus:border-spark-dark"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/70">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="So we can reply"
            className="mt-1.5 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-[13px] outline-none transition-colors placeholder:text-ink-muted/40 focus:border-spark-dark"
          />
        </label>
      </div>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/70">
        {mode === "feedback" ? "What is this about?" : "Topic"}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {feedbackTopics.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTopic(item)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
              topic === item
                ? "border-ink bg-ink text-white"
                : "border-ink/10 text-ink-muted hover:border-ink/30 hover:text-ink",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/70">
          Message
        </span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          placeholder={
            mode === "feedback"
              ? "What worked, what broke, and what would make it better?"
              : "Tell us what you are building or what you need help with."
          }
          className="mt-1.5 w-full resize-y rounded-xl border border-ink/15 px-3 py-2.5 text-[13px] leading-relaxed outline-none transition-colors placeholder:text-ink-muted/40 focus:border-spark-dark"
        />
      </label>

      {error && (
        <p className="mt-2 text-[11px] font-medium text-red-600">{error}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="submit" className={buttonClass("primary", "md")}>
          <Send className="h-4 w-4" />
          {mode === "feedback" ? "Send feedback" : "Send message"}
        </button>
        <button type="button" onClick={copy} className={buttonClass("outline", "md")}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy instead"}
        </button>
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-ink-muted/70">
        <Mail className="mt-0.5 h-3 w-3 shrink-0" />
        Sending opens your own email app with the message filled in, so you stay
        in control of what is shared.
      </p>
    </form>
  );
}
