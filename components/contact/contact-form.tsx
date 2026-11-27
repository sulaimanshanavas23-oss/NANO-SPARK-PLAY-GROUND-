"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Loader2, Send } from "lucide-react";

const CONTACT_EMAIL = "nanospark46@gmail.com";
const MAX = { name: 100, email: 200, school: 150, message: 1000 } as const;

function clean(value: string, max: number) {
  return value.replace(/[<>]/g, "").trim().slice(0, max);
}

type Status = "idle" | "sending" | "success";

export function ContactForm() {
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: clean(name, MAX.name),
      email: clean(email, MAX.email),
      school: clean(school, MAX.school),
      message: clean(message, MAX.message),
    };

    if (!payload.name) {
      setError("Please add your name.");
      return;
    }
    if (!payload.message) {
      setError("Please tell us a little about what you need.");
      return;
    }

    setError(null);
    setStatus("sending");

    const subject = `CONTACT — ${payload.name}`;
    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            school: payload.school,
            message: payload.message,
            _subject: subject,
          }),
        },
      );

      if (!response.ok) throw new Error("Form service unavailable");
      setStatus("success");
    } catch {
      const body = [
        `Name: ${payload.name}`,
        `Email: ${payload.email || "Not provided"}`,
        `School / Organization: ${payload.school || "Not provided"}`,
        "",
        payload.message,
      ].join("\n");

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;

      setStatus("idle");
      setError(
        "We could not reach the server, so we opened your email app instead. Your message is pre-filled — just hit send.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col items-center py-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-spark-yellow">
            <Check className="h-8 w-8 text-ink" strokeWidth={3} />
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold text-ink">
            Message sent
          </h2>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink-muted">
            Thanks for reaching out. We&apos;ll reply within a day.
          </p>
          <button
            type="button"
            onClick={() => {
              setName("");
              setEmail("");
              setSchool("");
              setMessage("");
              setStatus("idle");
            }}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-spark-yellow hover:text-ink"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="font-display text-2xl font-extrabold text-ink">
        Send a message
      </h2>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
        Your message goes straight to our Gmail and WhatsApp &mdash; we reply
        within a day.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="ct-name" className="text-[12px] font-bold text-ink">
            Name
          </label>
          <input
            id="ct-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={MAX.name}
            placeholder="Name"
            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-spark-dark focus:ring-2 focus:ring-spark-yellow/40"
          />
        </div>

        <div>
          <label htmlFor="ct-email" className="text-[12px] font-bold text-ink">
            Email
          </label>
          <input
            id="ct-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={MAX.email}
            placeholder="Email"
            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-spark-dark focus:ring-2 focus:ring-spark-yellow/40"
          />
        </div>

        <div>
          <label htmlFor="ct-school" className="text-[12px] font-bold text-ink">
            School / Organization
          </label>
          <input
            id="ct-school"
            value={school}
            onChange={(event) => setSchool(event.target.value)}
            maxLength={MAX.school}
            placeholder="School / Organization"
            className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-spark-dark focus:ring-2 focus:ring-spark-yellow/40"
          />
        </div>

        <div>
          <label htmlFor="ct-message" className="text-[12px] font-bold text-ink">
            Message
          </label>
          <textarea
            id="ct-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            maxLength={MAX.message}
            placeholder="Tell us what you'd like to explore — workshops, STEM labs, kits, or partnerships..."
            className="mt-1.5 w-full resize-y rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none transition placeholder:text-ink/40 focus:border-spark-dark focus:ring-2 focus:ring-spark-yellow/40"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-[12.5px] font-medium text-red-600"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-spark-yellow px-6 py-3.5 font-display text-sm font-bold text-ink shadow-soft transition-colors hover:bg-ink hover:text-spark-yellow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send Message <Send className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
