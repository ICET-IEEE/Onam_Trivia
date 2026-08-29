import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { createClient } from "@/lib/supabase/server";

export async function FinalCTA() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const enterHref = user ? "/chapters" : "/signup";

  return (
    <section className="relative overflow-hidden section-pad py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15"
      />

      <div className="container-max relative text-center">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-4xl sm:text-5xl">Will You Complete the Three Steps?</h2>
          <p className="mt-5 text-lg text-ink-soft">
            The kingdom remembers those who rise to the trial.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={enterHref} variant="primary" withArrow>
              Enter the Trial
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
