"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Loader2, Send, Star } from "lucide-react";
import { Confetti } from "@/components/feedback/confetti";
import { cn } from "@/src/lib/utils";

const MAX = {
  name: 100,
  email: 200,
  school: 150,
  workshop: 150,
  comments: 1000,
} as const;

const CONTACT_EMAIL = "nanospark46@gmail.com";

const ratingMessages: Record<number, string> = {
  1: "Thanks — we will work on it.",
  2: "Thanks for the honesty.",
  3: "Good — we can do better.",
  4: "Great! Glad you enjoyed it.",
  5: "Amazing! You made our day.",
};

function clean(value: string, max: number) {
  return value.replace(/[<>]/g, "").trim().slice(0, max);
}

type Status = "idle" | "sending" | "success";

function StarsInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const reduceMotion = useReducedMotion();
  const active = hovered || value;

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(Math.max(1, (value || 1) - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      onChange(1);
    } else if (event.key === "End") {
      event.preventDefault();
      onChange(5);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Rate your experience"
      className="flex items-center justify-center gap-1.5 sm:gap-2"
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const checked = value === star;
        return (
          <motion.button
            key={star}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            tabIndex={checked || (!value && star === 1) ? 0 : -1}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            whileHover={reduceMotion ? undefined : { scale: 1.25, rotate: -8 }}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            className="rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark-yellow focus-visible:ring-offset-2"
          >
            <Star
              className={cn(
                "h-9 w-9 transition-colors sm:h-10 sm:w-10",
                star <= active
                  ? "fill-spark-yellow text-spark-yellow"
                  : "fill-transparent text-ink/15",
              )}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

export function FeedbackForm() {
  const reduceMotion = useReducedMotion();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [workshop, setWorkshop] = useState("");
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);

  const reset = useCallback(() => {
    setRating(0);
    setName("");
    setEmail("");
    setSchool("");
    setWorkshop("");
    setComments("");
    setStatus("idle");
    setError(null);
    setConfetti(false);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: clean(name, MAX.name),
      email: clean(email, MAX.email),
      school: clean(school, MAX.school),
      workshop: clean(workshop, MAX.workshop),
      comments: clean(comments, MAX.comments),
    };

    if (!rating) {
      setError("Please choose a star rating before submitting.");
      return;
    }
    if (!payload.name) {
      setError("Please add your name so we know who to thank.");
      return;
    }
    if (!payload.comments) {
      setError("Please add a few words in the comments.");
      return;
    }

    setError(null);
    setStatus("sending");

    const subject = `FEEDBACK — ${payload.name} (${rating}/5)`;
    const formData = {
      name: payload.name,
      email: payload.email,
      school: payload.school,
      workshop: payload.workshop,
      rating: `${rating}/5`,
      comments: payload.comments,
      _subject: subject,
    };

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Form service unavailable");

      setStatus("success");
      setConfetti(true);
    } catch {
      const body = [
        `Name: ${payload.name}`,
        `Email: ${payload.email || "Not provided"}`,
        `School / Organization: ${payload.school || "Not provided"}`,
        `Workshop attended: ${payload.workshop || "Not provided"}`,
        `Rating: ${rating}/5`,
        "",
        payload.comments,
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

  return (
    <div className="relative">
      {confetti && <Confetti onDone={() => setConfetti(false)} />}

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="rounded-3xl border-2 border-spark-yellow bg-white p-8 text-center shadow-soft sm:p-10"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={reduceMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 16,
                delay: 0.15,
              }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-spark-yellow"
            >
              <Check className="h-10 w-10 text-ink" strokeWidth={3} />
            </motion.div>
            <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">
              Thank you! <span className="text-spark-dark">{"\\o/"}</span>
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-muted">
              Your feedback means the world to us at Nano Spark. We&apos;ll keep
              building better experiences for young innovators.
            </p>
            <motion.button
              type="button"
              onClick={reset}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 font-display text-sm font-bold text-white shadow-soft transition-colors hover:bg-spark-yellow hover:text-ink"
            >
              Submit Another
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={false}
            className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
          >
            <h2 className="font-display text-2xl font-extrabold text-ink">
              Rate your experience
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
              A quick rating and a few words go a long way.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-5">
              <StarsInput value={rating} onChange={setRating} />

              <div className="mt-2 min-h-[24px] text-center">
                <AnimatePresence mode="wait">
                  {rating > 0 && (
                    <motion.p
                      key={rating}
                      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                      className="text-[12px] font-semibold text-spark-dark"
                    >
                      You rated {rating} of 5 &mdash; {ratingMessages[rating]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fb-name"
                    className="text-[12px] font-bold text-ink"
                  >
                    Name
                  </label>
                  <input
                    id="fb-name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={MAX.name}
                    required
                    placeholder="Your name"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-spark-dark focus:ring-2 focus:ring-spark-yellow/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="fb-email"
                    className="text-[12px] font-bold text-ink"
                  >
                    Email{" "}
                    <span className="font-medium text-ink/45">(optional)</span>
                  </label>
                  <input
                    id="fb-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    maxLength={MAX.email}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-spark-dark focus:ring-2 focus:ring-spark-yellow/40"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fb-school"
                    className="text-[12px] font-bold text-ink"
                  >
                    School / Organization{" "}
                    <span className="font-medium text-ink/45">(optional)</span>
                  </label>
                  <input
                    id="fb-school"
                    name="school"
                    value={school}
                    onChange={(event) => setSchool(event.target.value)}
                    maxLength={MAX.school}
                    placeholder="Your school or organization"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-spark-dark focus:ring-2 focus:ring-spark-yellow/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="fb-workshop"
                    className="text-[12px] font-bold text-ink"
                  >
                    Workshop Attended{" "}
                    <span className="font-medium text-ink/45">(optional)</span>
                  </label>
                  <input
                    id="fb-workshop"
                    name="workshop"
                    value={workshop}
                    onChange={(event) => setWorkshop(event.target.value)}
                    maxLength={MAX.workshop}
                    placeholder="e.g. Robotics Workshop, STEM Lab Program"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-spark-dark focus:ring-2 focus:ring-spark-yellow/40"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="fb-comments"
                  className="text-[12px] font-bold text-ink"
                >
                  Comments
                </label>
                <textarea
                  id="fb-comments"
                  name="comments"
                  value={comments}
                  onChange={(event) => setComments(event.target.value)}
                  rows={4}
                  maxLength={MAX.comments}
                  required
                  placeholder="What did you enjoy? What could we improve?"
                  className="mt-1.5 w-full resize-y rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-ink outline-none transition placeholder:text-ink/40 focus:border-spark-dark focus:ring-2 focus:ring-spark-yellow/40"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    role="alert"
                    className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-[12.5px] font-medium text-red-600"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={status === "sending"}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-spark-yellow px-6 py-3 font-display text-sm font-bold text-ink shadow-soft transition-colors hover:bg-ink hover:text-spark-yellow disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Feedback
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
