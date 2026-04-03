import { FadeIn } from "../effects/FadeIn";

/**
 * Editorial pain beat: narrow context rail + dominant pull-quote + consequence + gold GitLore payoff.
 * Surfaces only - bordered frame, no gradients. Error color reserved for the review fragment.
 */
const PainStatement = () => {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)]">
      <FadeIn direction="up">
        <div className="landing-container py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-[1040px]">
            <div className="section-label">
              <p>Sound familiar</p>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-x-14 lg:gap-y-0">
              {/* Rail: setup (+ "Two words" only on large screens, bottom-aligned) */}
              <aside className="flex min-h-0 flex-col lg:border-r lg:border-[var(--border)] lg:pr-10">
                <span className="font-code text-[10px] font-medium uppercase tracking-[3px] text-[var(--text-ghost)]">01 - The review</span>
                <div className="mt-5 hidden h-px w-8 bg-[var(--accent)] lg:block" aria-hidden />
                <div className="mt-6 space-y-1 lg:mt-10">
                  <p className="font-heading text-[18px] font-medium leading-snug tracking-[-0.02em] text-[var(--text-secondary)] md:text-[20px]">
                    You get a code review.
                  </p>
                  <p className="font-heading text-[18px] font-medium leading-snug tracking-[-0.02em] text-[var(--text-secondary)] md:text-[20px]">
                    It says
                  </p>
                </div>
                <p className="font-heading mt-8 hidden max-w-[15rem] text-[15px] font-normal leading-relaxed tracking-[-0.01em] text-[var(--text-ghost)] lg:mt-auto lg:block lg:pt-12 lg:text-[16px]">
                  Two words. No explanation.
                </p>
              </aside>

              {/* Main column: quote -> mobile aftermath -> cost -> payoff */}
              <div className="min-w-0">
                <blockquote className="pain-pull-quote m-0 border-none p-0 font-heading text-[clamp(2.75rem,_11vw,_5.25rem)] font-bold leading-[0.9] tracking-[-0.06em] text-[var(--error)]">
                  <span className="text-[0.55em] font-semibold text-[var(--error)] opacity-90 [vertical-align:0.12em]">&lsquo;</span>
                  memory leak.
                  <span className="text-[0.55em] font-semibold text-[var(--error)] opacity-90 [vertical-align:0.12em]">&rsquo;</span>
                </blockquote>

                <p className="font-heading mt-3 text-[15px] font-normal leading-relaxed tracking-[-0.01em] text-[var(--text-ghost)] lg:hidden">
                  Two words. No explanation.
                </p>

                <div className="mt-8 max-w-[540px] border-l-2 border-[var(--error-dim)] pl-5 md:mt-10 md:pl-6">
                  <p className="font-body text-[15px] leading-[1.8] text-[var(--text-secondary)] md:text-[16px]">
                    You spend 30 minutes Googling, copy-pasting into ChatGPT, or pinging your senior on Slack.
                  </p>
                </div>

                <div className="mt-10 max-w-[560px] rounded-sm border border-[var(--border)] bg-[var(--elevated)] px-5 py-5 md:mt-12 md:px-6 md:py-6">
                  <p className="font-heading text-[clamp(1.375rem,3.5vw,2rem)] font-semibold leading-tight tracking-[-0.03em]">
                    <span className="text-[var(--accent)]">GitLore</span>
                    <span className="text-[var(--text)]"> does it in one click.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

export default PainStatement;
