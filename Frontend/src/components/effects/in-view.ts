/**
 * Shared IntersectionObserver setup for React Bits–style components.
 * Registry versions often use ScrollTrigger; these use native IO (lighter, no premium GSAP plugins).
 */
export type InViewOptions = {
  threshold?: number;
  rootMargin?: string;
};

export function observeOnce(
  element: Element,
  visibleClass: string,
  options: InViewOptions = {},
): () => void {
  const { threshold = 0.1, rootMargin = "0px" } = options;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add(visibleClass);
        observer.disconnect();
      }
    },
    { threshold, rootMargin },
  );
  observer.observe(element);
  return () => observer.disconnect();
}

/** Fire once when the element enters the viewport (no CSS class). */
export function observeOnceCallback(
  element: Element,
  onVisible: () => void,
  options: InViewOptions = {},
): () => void {
  const { threshold = 0.1, rootMargin = "0px" } = options;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        onVisible();
        observer.disconnect();
      }
    },
    { threshold, rootMargin },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
