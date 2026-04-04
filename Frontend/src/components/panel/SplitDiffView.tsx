import { useEffect, useRef } from "react";
import { animate as animeAnimate } from "animejs";

type Props = {
  buggyCode: string;
  fixedCode: string;
};

/** Split diff: red left (#2D0000), green right (#002D00) with line stagger animation. */
export function SplitDiffView({ buggyCode, fixedCode }: Props) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftLines = leftRef.current?.querySelectorAll(".diff-line") ?? [];
    const rightLines = rightRef.current?.querySelectorAll(".diff-line") ?? [];
    const all = [...leftLines, ...rightLines];
    if (!all.length) return;
    const anims = all.map((el, i) =>
      animeAnimate(el as HTMLElement, {
        opacity: [0, 1],
        translateX: [-10, 0],
        duration: 300,
        delay: i * 50,
        ease: "outQuart",
      })
    );
    return () => {
      for (const a of anims) a.revert?.();
    };
  }, [buggyCode, fixedCode]);

  const leftLines = buggyCode.split("\n");
  const rightLines = fixedCode.split("\n");

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div ref={leftRef} className="min-w-0">
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-red-400/90">
          Buggy code
        </div>
        <pre
          className="overflow-x-auto whitespace-pre rounded-sm border border-red-900/40 p-3 font-code text-xs leading-5 text-gitlore-text"
          style={{ backgroundColor: "#2D0000" }}
        >
          {leftLines.map((line, i) => (
            <div key={`l-${i}`} className="diff-line">
              {line}
            </div>
          ))}
        </pre>
      </div>
      <div ref={rightRef} className="min-w-0">
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-emerald-400/90">
          Suggested fix
        </div>
        <pre
          className="overflow-x-auto whitespace-pre rounded-sm border border-emerald-900/40 p-3 font-code text-xs leading-5 text-gitlore-text"
          style={{ backgroundColor: "#002D00" }}
        >
          {rightLines.map((line, i) => (
            <div key={`r-${i}`} className="diff-line">
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
