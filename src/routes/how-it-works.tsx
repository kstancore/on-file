import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, FileText, Mail } from "lucide-react";
import { HRGuide } from "@/components/HRGuide";
import { OfficeShell } from "@/components/OfficeShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How a Session Runs — What On File Does" },
      {
        name: "description",
        content:
          "What On File does with your job description, resume and rejection email — and how a session runs from opening your desk to walking out with a 90-day plan.",
      },
      { property: "og:title", content: "How a Session Runs — What On File Does" },
      {
        property: "og:description",
        content: "From dropping off three documents to a fit score, missing skills and a 90-day comeback plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <OfficeShell>
      <section className="mx-auto max-w-5xl px-4 pt-10 sm:pt-16">
        <span className="sticky-note inline-block -rotate-1 px-3 py-1 text-xs font-medium uppercase tracking-widest">
          The process
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl leading-[1.1] sm:text-5xl">
          What On File does, and how a session runs.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Three documents in, one honest post-mortem out. Here's exactly what happens on the desk between those two
          moments.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-5xl px-4">
        <h2 className="font-display text-3xl">What On File does</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Briefcase,
              t: "Reads the role like a hiring panel",
              d: "Every requirement and nice-to-have from the job description, pulled apart and weighted.",
            },
            {
              icon: FileText,
              t: "Audits your resume against it",
              d: "Where your evidence is thin, where the wording buries your best work, what's simply missing.",
            },
            {
              icon: Mail,
              t: "Decodes the rejection email",
              d: "The polite phrasing usually hides a specific reason. Shanthi names it plainly.",
            },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="paper-card p-5">
              <span className="flex size-9 items-center justify-center rounded-md bg-folder text-folder-foreground">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-3 text-lg">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-4">
        <h2 className="font-display text-3xl">How a session runs</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { n: "01", t: "Create your desk", d: "An account keeps your workspace private and your reports yours." },
            { n: "02", t: "Drop the paperwork", d: "Job description, resume, rejection email — exactly what they saw." },
            { n: "03", t: "Leave with a plan", d: "Missing skills, resume fixes and what to do this week." },
          ].map((s) => (
            <div key={s.n} className="paper-card p-5">
              <span className="font-display text-3xl text-accent">{s.n}</span>
              <h3 className="mt-2 text-lg">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-4">
        <h2 className="font-display text-3xl">What lands in your report</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { t: "A fit score", d: "How close you actually were, against the role as written." },
            { t: "The real rejection reasons", d: "Ranked, in plain language, with the evidence behind each one." },
            { t: "Missing skills by severity", d: "Blockers first, then the nice-to-haves worth picking up." },
            { t: "Rewritten resume bullets", d: "Your own experience, phrased the way a panel scores it." },
            { t: "Resume gaps", d: "Where the document quietly worked against you." },
            { t: "A 90-day comeback plan", d: "This week, this month, this quarter." },
          ].map((s) => (
            <div key={s.t} className="paper-card p-5">
              <h3 className="text-lg">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <HRGuide pose="verdict" size="md" line="Nothing here is a guess — every line points back to your paperwork." />
          <Button asChild size="lg">
            <Link to="/workspace">Open my workspace</Link>
          </Button>
        </div>
      </section>
    </OfficeShell>
  );
}
