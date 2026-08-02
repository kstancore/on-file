import { createFileRoute, Link } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { HRGuide } from "@/components/HRGuide";
import { OfficeShell } from "@/components/OfficeShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shanthi")({
  head: () => ({
    meta: [
      { title: "Meet Shanthi — Your Senior Recruiter Guide | On File" },
      {
        name: "description",
        content:
          "Shanthi is the senior recruiter behind On File: fifteen years of hiring panels across product and engineering, and a habit of saying what the rejection email left out.",
      },
      { property: "og:title", content: "Meet Shanthi — Your Senior Recruiter Guide" },
      {
        property: "og:description",
        content: "Fifteen years of hiring panels, and a habit of saying what the rejection email left out.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShanthiPage,
});

function ShanthiPage() {
  return (
    <OfficeShell>
      <section className="mx-auto max-w-5xl px-4 pt-10 sm:pt-16">
        <div className="paper-card tape-strip grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr]">
          <HRGuide
            pose="greeting"
            size="lg"
            priority
            className="justify-center"
            line="Fifteen years of hiring panels. I know exactly what gets someone cut — and how to fix it."
          />

          <div>
            <span className="sticky-note inline-block rotate-1 px-3 py-1 text-xs font-medium uppercase tracking-widest">
              Meet your guide
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl">Shanthi</h1>
            <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">
              Senior recruiter · 15 years across product &amp; engineering hiring
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Shanthi grew up in Coimbatore, started out screening graduate applications, and has since sat on hundreds
              of hiring panels. She's the recruiter who tells you the thing nobody wrote in the email — kindly, but
              without softening it into uselessness.
            </p>
            <p className="mt-3 flex gap-2 text-base italic leading-relaxed text-foreground">
              <Quote className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
              “A rejection is data, not a verdict. Most people never get to read theirs. Here, you do.”
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-4">
        <h2 className="font-display text-3xl">How she reads an application</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Panel-first, not candidate-first",
              d: "She starts from what the hiring panel was told to look for, then works back to your paperwork.",
            },
            {
              t: "Evidence over adjectives",
              d: "“Strong communicator” means nothing on a scorecard. She looks for the moment you proved it.",
            },
            {
              t: "Kind, but specific",
              d: "No vague encouragement. If the gap is two years of production ownership, she says exactly that.",
            },
          ].map((s) => (
            <div key={s.t} className="paper-card p-5">
              <h3 className="text-lg">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-4">
        <div className="paper-card flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
          <HRGuide
            pose="thinking"
            size="md"
            line="Bring me the three documents and I'll tell you what the panel actually said."
          />
          <Button asChild size="lg">
            <Link to="/workspace">Open my workspace</Link>
          </Button>
        </div>
      </section>
    </OfficeShell>
  );
}
