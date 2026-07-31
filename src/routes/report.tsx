import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, ListChecks, PenLine, Target } from "lucide-react";
import { loadReport, type AnalysisReport } from "@/lib/analysis-types";
import { HRGuide } from "@/components/HRGuide";
import { OfficeShell } from "@/components/OfficeShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Your Rejection Report — On File" },
      {
        name: "description",
        content:
          "Shanthi's honest breakdown of your rejection: fit score, missing skills, resume gaps and a step-by-step comeback plan.",
      },
      { property: "og:title", content: "Your Rejection Report — On File" },
      {
        property: "og:description",
        content: "Fit score, missing skills, resume gaps and a step-by-step comeback plan for your next interview.",
      },
    ],
  }),
  component: ReportPage,
});

const importanceStyles: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  important: "bg-accent text-accent-foreground",
  "nice-to-have": "bg-secondary text-secondary-foreground",
};

function ReportPage() {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReport(loadReport());
    setReady(true);
  }, []);

  if (!ready) return <OfficeShell>{null}</OfficeShell>;

  if (!report) {
    return (
      <OfficeShell>
        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <HRGuide
            pose="thinking"
            size="md"
            className="justify-center"
            line="There's nothing in this folder yet. Bring me your documents and I'll take a look."
          />
          <h1 className="mt-8 text-3xl">No case file open</h1>
          <p className="mt-2 text-muted-foreground">Start at the front desk to get your analysis.</p>
          <Button asChild className="mt-6">
            <Link to="/">
              <ArrowLeft className="mr-2 size-4" /> Back to the front desk
            </Link>
          </Button>
        </section>
      </OfficeShell>
    );
  }

  return (
    <OfficeShell>
      <section className="mx-auto max-w-5xl px-4 pt-10">
        <div className="paper-card grid gap-6 p-6 sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <HRGuide pose="verdict" size="lg" priority className="justify-center" line={report.encouragement} />
          <div>
            <span className="sticky-note inline-block rotate-1 px-3 py-1 text-xs font-medium uppercase tracking-widest">
              Case file · {report.roleTitle}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl">The honest read</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">{report.verdict}</p>

            <div className="mt-6">
              <div className="flex items-end justify-between text-sm">
                <span className="font-semibold">Resume-to-role fit</span>
                <span className="font-display text-3xl text-primary">{report.fitScore}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${report.fitScore}%` }} />
              </div>
            </div>

            {report.toneRead ? (
              <p className="mt-5 rounded-lg border border-border bg-secondary/50 p-3 text-sm">
                <span className="font-semibold">Reading their email: </span>
                {report.toneRead}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <Block title="Why you were rejected" icon={AlertTriangle}>
        <div className="grid gap-4 sm:grid-cols-2">
          {report.rejectionReasons.map((r, i) => (
            <div key={i} className="paper-card border-l-4 border-l-destructive p-4">
              <h3 className="text-base font-semibold">{r.reason}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Skills you're missing" icon={Target}>
        <div className="grid gap-4 sm:grid-cols-2">
          {report.missingSkills.map((s, i) => (
            <div key={i} className="paper-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{s.skill}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide ${
                    importanceStyles[s.importance] ?? importanceStyles["nice-to-have"]
                  }`}
                >
                  {s.importance}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.evidence}</p>
              <p className="mt-2 rounded-md bg-secondary/60 p-2 text-sm">
                <span className="font-semibold">Close it: </span>
                {s.howToClose}
              </p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="What your resume left out" icon={ListChecks}>
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="paper-card space-y-3 p-5">
            {report.resumeGaps.map((g, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
          <ul className="paper-card space-y-3 p-5">
            <li className="font-display text-lg">What already works for you</li>
            {report.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </Block>

      {report.rewrittenBullets.length ? (
        <Block title="Bullets, rewritten" icon={PenLine}>
          <div className="grid gap-3">
            {report.rewrittenBullets.map((b, i) => (
              <p key={i} className="sticky-note -rotate-[0.4deg] p-4 text-sm">
                {b}
              </p>
            ))}
          </div>
        </Block>
      ) : null}

      <Block title="Your comeback plan" icon={ListChecks}>
        <ol className="relative space-y-4 border-l-2 border-dashed border-border pl-6">
          {report.actionPlan.map((a, i) => (
            <li key={i} className="paper-card relative p-4">
              <span className="absolute -left-[2.05rem] top-5 size-3 rounded-full bg-primary ring-4 ring-background" />
              <span className="font-display text-xs uppercase tracking-widest text-primary">{a.timeframe}</span>
              <h3 className="mt-1 text-base font-semibold">{a.action}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.why}</p>
            </li>
          ))}
        </ol>
      </Block>

      <section className="mx-auto mt-12 max-w-5xl px-4">
        <div className="paper-card flex flex-col items-center gap-4 p-6 text-center">
          <HRGuide pose="greeting" size="sm" />
          <p className="max-w-md text-sm text-muted-foreground">
            Got another rejection to decode? Bring it in — patterns across roles tell us even more.
          </p>
          <Button asChild variant="secondary">
            <Link to="/">Analyse another rejection</Link>
          </Button>
        </div>
      </section>
    </OfficeShell>
  );
}

function Block({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Target;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-12 max-w-5xl px-4">
      <h2 className="mb-4 flex items-center gap-2 text-2xl">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Icon className="size-4" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
