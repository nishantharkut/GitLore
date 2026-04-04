import { useEffect, useRef } from "react";
import { animate as animeAnimate } from "animejs";
import { GitBranch, MessageSquare } from "lucide-react";

export type ActiveFeature = "archaeology" | "review";

type Props = {
  activeFeature: ActiveFeature;
  onToggle: (feature: ActiveFeature) => void;
};

const ORANGE = "#F97316";
const BLUE = "#3B82F6";

export function FeatureToggle({ activeFeature, onToggle }: Props) {
  const isReview = activeFeature === "review";
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const skipFirst = useRef(true);

  useEffect(() => {
    const el = indicatorRef.current;
    const parent = wrapRef.current;
    if (!el || !parent) return;
    const w = parent.offsetWidth;
    const slide = Math.max(0, w / 2 - 2);
    if (skipFirst.current) {
      el.style.transform = `translateX(${isReview ? slide : 0}px)`;
      skipFirst.current = false;
      return;
    }
    animeAnimate(el, {
      translateX: isReview ? slide : 0,
      duration: 250,
      ease: "inOutQuart",
    });
  }, [isReview]);

  return (
    <div
      ref={wrapRef}
      className="feature-toggle relative inline-flex rounded-full border border-gitlore-border bg-gitlore-code/60 p-0.5 shadow-sm"
      role="group"
      aria-label="Feature mode"
    >
      <span
        ref={indicatorRef}
        className="feature-toggle-indicator pointer-events-none absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full shadow-sm"
        style={{
          backgroundColor: isReview ? BLUE : ORANGE,
        }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => onToggle("archaeology")}
        className={`relative z-10 flex min-w-[7.5rem] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors md:min-w-[8.5rem] md:text-[13px] ${
          !isReview ? "text-white" : "text-gitlore-text-secondary hover:text-gitlore-text"
        }`}
      >
        <GitBranch className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden />
        Live Repo
      </button>
      <button
        type="button"
        onClick={() => onToggle("review")}
        className={`relative z-10 flex min-w-[7.5rem] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors md:min-w-[8.5rem] md:text-[13px] ${
          isReview ? "text-white" : "text-gitlore-text-secondary hover:text-gitlore-text"
        }`}
      >
        <MessageSquare className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden />
        Review Comments
      </button>
    </div>
  );
}
