import { useState } from "react";
import type { InsightExplanation } from "@/lib/gitloreApi";
import { postNarrate } from "@/lib/gitloreApi";
import { SplitDiffView } from "./SplitDiffView";

function extractAddedFromDiff(diffHunk: string | null | undefined): string {
  if (!diffHunk?.trim()) return "";
  return diffHunk
    .split("\n")
    .filter((l) => l.startsWith("+") && !l.startsWith("+++"))
    .map((l) => l.slice(1))
    .join("\n");
}

const ACCENT = "#3B82F6";

type Props = {
  data: InsightExplanation | null;
  loading: boolean;
  error: string | null;
  diffHunk?: string | null;
  prNumber?: number | null;
  onRetry?: () => void;
};

export function ExplanationView({
  data,
  loading,
  error,
  diffHunk,
  prNumber,
  onRetry,
}: Props) {
  const [narrateBusy, setNarrateBusy] = useState(false);

  if (loading) {
    return (
      <div className="panel-content space-y-4 p-4 font-body md:p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gitlore-border/60" />
        <div className="h-3 w-full animate-pulse rounded bg-gitlore-border/40" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-gitlore-border/40" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-gitlore-border/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-content space-y-4 p-4 font-body md:p-5">
        <p className="text-sm text-gitlore-error">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-sm border border-gitlore-border px-3 py-1.5 text-sm text-gitlore-text hover:border-gitlore-accent hover:text-gitlore-accent"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!data) return null;

  const conf = data.confidence;
  const confBadge =
    conf === "HIGH"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : conf === "MEDIUM"
        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
        : "bg-red-500/15 text-red-400 border-red-500/30";

  const buggy =
    extractAddedFromDiff(diffHunk ?? undefined) || data.whatsWrong || data.buggyCode;
  const fixedSide = data.fixedCode || "(no fix suggested)";

  const handleNarrate = async () => {
    const script = [
      data.patternName || data.header,
      data.whatsWrong,
      data.why,
      data.principle,
    ]
      .filter(Boolean)
      .join(". ");
    if (!script.trim()) return;
    setNarrateBusy(true);
    try {
      await postNarrate(script.slice(0, 8000));
    } finally {
      setNarrateBusy(false);
    }
  };

  return (
    <div className="panel-content flex flex-col gap-5 p-4 font-body md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug" style={{ color: ACCENT }}>
            {data.patternName || data.header}
          </h3>
          {data.confidenceReason && (
            <p className="mt-1 text-xs text-gitlore-text-secondary/80">{data.confidenceReason}</p>
          )}
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium ${confBadge}`}
        >
          {conf}
        </span>
      </div>

      <SplitDiffView buggyCode={buggy} fixedCode={fixedSide} />

      <section>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-gitlore-text-secondary">
          What&apos;s wrong
        </div>
        <p className="text-sm leading-relaxed text-gitlore-text">{data.whatsWrong}</p>
      </section>

      <section>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-gitlore-text-secondary">
          Why it matters
        </div>
        <p className="text-sm leading-relaxed text-gitlore-text">{data.whyItMatters ?? data.why}</p>
      </section>

      <section>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-gitlore-text-secondary">
          The principle
        </div>
        <button
          type="button"
          className="inline-flex rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400"
        >
          {data.principle}
        </button>
        {data.docsLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {data.docsLinks.map((u) => (
              <a
                key={u}
                href={u.startsWith("http") ? u : `https://${u}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 hover:underline"
              >
                → Docs
              </a>
            ))}
          </div>
        )}
      </section>

      {data.source && (
        <a
          href={data.source.commentUrl || "#"}
          target="_blank"
          rel="noreferrer"
          className="block text-sm text-gitlore-text-secondary transition-colors hover:text-blue-400"
        >
          Based on: PR #{prNumber ?? "?"} review by @{data.source.commentBy}
        </a>
      )}

      <button
        type="button"
        disabled={narrateBusy}
        onClick={() => void handleNarrate()}
        className="inline-flex items-center gap-2 rounded-sm border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/20 disabled:opacity-50"
      >
        ▶ Hear the explanation
      </button>
    </div>
  );
}
