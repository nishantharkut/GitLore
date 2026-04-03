import { useRef, useEffect, type ReactNode, type ElementType } from "react";
import { observeOnce, type InViewOptions } from "./in-view";

export interface BlurRevealProps extends InViewOptions {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "span" | "h2" | "h3";
}

export function BlurReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  threshold = 0.1,
  rootMargin = "0px",
}: BlurRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--blur-delay", `${delay}ms`);
    return observeOnce(el, "blur-visible", { threshold, rootMargin });
  }, [delay, threshold, rootMargin]);

  const Comp = Tag as ElementType;

  return (
    <Comp ref={ref} className={`blur-reveal ${className}`.trim()}>
      {children}
    </Comp>
  );
}
