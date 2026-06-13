"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { api } from "@/lib";
import type { Job } from "@/types";

const FEEDBACK_TAGS = [
  "Fast Delivery",
  "Polite",
  "Great Communication",
  "Accurate Order",
  "Above and Beyond",
];

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [quest, setQuest] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchQuest() {
      try {
        const data = await api.jobs.get(id);
        setQuest(data.job ?? null);
      } finally {
        setLoading(false);
      }
    }
    fetchQuest();
  }, [id]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  async function handleSubmit() {
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    try {
      await api.jobs.review(id, { score: rating, comment, tags: selectedTags });
      setSubmitted(true);
      setTimeout(() => router.push("/quests"), 1500);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-lg animate-pulse space-y-md">
        <div className="h-8 bg-surface-container-high rounded w-1/2" />
        <div className="h-32 bg-surface-container-high rounded" />
        <div className="h-48 bg-surface-container-high rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="px-lg pt-xl pb-md text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-block px-md py-xs bg-primary/10 border border-primary/20 text-primary font-mono text-xs rounded-full mb-md uppercase tracking-widest">
            Mission Success
          </span>
          <h1 className="font-sans text-4xl font-bold text-on-surface tracking-tighter leading-none mb-sm">
            Quest Completed
          </h1>
          <p className="text-sm text-on-surface-variant max-w-[280px] mx-auto">
            {quest
              ? `You've successfully finished "${quest.title}". Rate your experience.`
              : "Rate your experience with this quest."}
          </p>
        </div>
      </header>

      <main className="flex-1 px-lg flex flex-col gap-lg pb-3xl">
        {/* Quest / Runner card */}
        <section className="bg-surface border border-outline-variant rounded-xl p-md flex items-center gap-md">
          <div className="w-16 h-16 rounded-lg bg-primary/20 border border-outline-variant flex items-center justify-center shrink-0">
            <Icon name="person" size={32} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-sm">
              <h3 className="font-sans text-base font-semibold text-on-surface truncate">
                {quest?.title ?? "Quest Runner"}
              </h3>
              <span className="font-mono text-xs text-success flex items-center gap-xs shrink-0">
                <Icon name="verified" size={14} />
                Elite
              </span>
            </div>
            <div className="flex items-center gap-sm mt-xs flex-wrap">
              <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-sm py-[2px] rounded">
                ID: #{id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </section>

        {/* Star rating */}
        <section className="flex flex-col items-center gap-md py-sm">
          <h2 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
            Overall Rating
          </h2>
          <div className="flex gap-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90 hover:scale-110"
              >
                <Icon
                  name="grade"
                  filled={star <= rating}
                  size={48}
                  className={
                    star <= rating
                      ? "text-primary drop-shadow-[0_0_8px_rgba(208,188,255,0.6)]"
                      : "text-outline-variant"
                  }
                />
              </button>
            ))}
          </div>
        </section>

        {/* Feedback tags */}
        <section className="flex flex-col gap-md">
          <h2 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
            What went well?
          </h2>
          <div className="flex flex-wrap gap-sm">
            {FEEDBACK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`font-mono text-xs border px-md py-sm rounded-lg transition-all ${
                  selectedTags.includes(tag)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Comment */}
        <section className="flex flex-col gap-md">
          <h2 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
            Additional Notes
          </h2>
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-background border border-outline-variant rounded-xl p-md text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none min-h-[120px] outline-none"
              placeholder="Describe your experience with the Runner..."
            />
            <div className="absolute bottom-3 right-3 text-on-surface-variant font-mono text-[10px]">
              OPTIONAL
            </div>
          </div>
        </section>
      </main>

      {/* Submit footer */}
      <footer className="sticky bottom-20 lg:bottom-0 px-lg pb-lg pt-xl bg-gradient-to-t from-background via-background to-transparent">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={rating === 0 || submitting || submitted}
          className={`w-full font-sans font-semibold text-lg py-md rounded-xl flex items-center justify-center gap-sm transition-all ${
            submitted
              ? "bg-success text-white"
              : rating === 0
                ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                : "bg-primary text-on-primary glow-primary hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {submitted ? (
            <>
              <Icon name="check_circle" filled />
              Submitted!
            </>
          ) : submitting ? (
            <>
              <Icon name="refresh" className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Submit Review
              <Icon name="send" />
            </>
          )}
        </button>
        <p className="text-center font-mono text-[10px] text-on-surface-variant mt-md uppercase tracking-tighter">
          Transaction Securely Logged
        </p>
      </footer>
    </div>
  );
}
