import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Lightbulb, Coffee, Briefcase, FileText } from "lucide-react";
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
            <h1 className="mt-5 text-3xl leading-[1.1] sm:text-5xl">
              They said “we decided to move forward with other candidates”.
              <span className="block text-primary">Shanthi will tell you what that actually meant.</span>
            </h1>
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
            pose="interview"
            size="lg"
            priority
            className="justify-center md:justify-end"
            line="I've sat on the other side of that table for fifteen years. Show me the three documents and I'll be straight with you."
          />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/how-it-works" className="paper-card block p-6 transition-transform hover:-translate-y-0.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-folder text-folder-foreground">
              <Briefcase className="size-4" />
            </span>
            <h2 className="mt-3 font-display text-2xl">What On File does</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              How the job description, resume and rejection email are read — and how a session runs end to end.
            </p>
            <span className="mt-3 inline-block text-sm text-primary">Read the process →</span>
          </Link>
          <Link to="/shanthi" className="paper-card block p-6 transition-transform hover:-translate-y-0.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-folder text-folder-foreground">
              <FileText className="size-4" />
            </span>
            <h2 className="mt-3 font-display text-2xl">Meet Shanthi</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fifteen years of hiring panels, and a habit of saying what the rejection email left out.
            </p>
            <span className="mt-3 inline-block text-sm text-primary">About your guide →</span>
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <HRGuide pose="thinking" size="md" line="Two minutes of reading, then we get to work." />
          <Button asChild size="lg">
            <Link to="/workspace">Open my workspace</Link>
          </Button>
        </div>
      </section>
    </OfficeShell>
  );
}
