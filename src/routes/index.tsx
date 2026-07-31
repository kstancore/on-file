import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Lightbulb, Coffee, Briefcase, FileText, Mail, Quote } from "lucide-react";
import { HRGuide } from "@/components/HRGuide";
import { OfficeShell } from "@/components/OfficeShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "On File — Know Why You Got Rejected, Then Fix It" },
      {
        name: "description",
        content:
          "On File reads your job description, resume and rejection email, then Shanthi — a senior recruiter — explains the real reasons and what to fix before the next interview.",
      },
      { property: "og:title", content: "On File — Know Why You Got Rejected, Then Fix It" },
      {
        property: "og:description",
        content: "A clear rejection post-mortem: missing skills, resume gaps and a 90-day plan to land the role.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <OfficeShell>
      <section className="mx-auto max-w-5xl px-4 pt-10 sm:pt-16">
        <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="sticky-note inline-block -rotate-1 px-3 py-1 text-xs font-medium uppercase tracking-widest">
              Rejection post-mortem desk
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] sm:text-5xl">
              They said “we decided to move forward with other candidates”.
              <span className="block text-primary">Shanthi will tell you what that actually meant.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              On File is a small, honest office where your rejection gets reviewed properly. Bring the job description,
              your resume and the rejection email — leave with the real reasons, the skills you're missing and a plan
              for the next round.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/signup">Create an account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/signin">I already have one</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <Sparkles className="size-3.5 text-primary" /> Skill gap breakdown
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <Lightbulb className="size-3.5 text-accent-foreground" /> Rewritten resume bullets
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                <Coffee className="size-3.5 text-desk" /> 90-day comeback plan
              </span>
            </div>
          </div>
          <HRGuide
            pose="greeting"
            size="lg"
            priority
            className="justify-center desk-float md:justify-end"
            line="I've sat on the other side of that table for fifteen years. Show me the three documents and I'll be straight with you."
          />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-4">
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
        <div className="paper-card tape-strip grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr]">
          <HRGuide pose="thinking" size="lg" className="justify-center" />
          <div>
            <span className="sticky-note inline-block rotate-1 px-3 py-1 text-xs font-medium uppercase tracking-widest">
              Meet your guide
            </span>
            <h2 className="mt-4 font-display text-3xl">Shanthi</h2>
            <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">
              Senior recruiter · 15 years across product & engineering hiring
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
            <p className="mt-4 text-sm text-muted-foreground">
              She stays with you across every page — the front desk, the review, and the plan you walk out with.
            </p>
          </div>
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
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link to="/workspace">Open my workspace</Link>
          </Button>
        </div>
      </section>
    </OfficeShell>
  );
}
