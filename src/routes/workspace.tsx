import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Briefcase, FileText, Mail, Loader2, Upload, X, Sparkles, Coffee, Lightbulb } from "lucide-react";
import { analyzeApplication } from "@/lib/analysis.functions";
import { saveReport } from "@/lib/analysis-types";
import { HRGuide } from "@/components/HRGuide";
import { useAuth } from "@/hooks/useAuth";
import { OfficeShell } from "@/components/OfficeShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — Analyse Your Rejection | On File" },
      {
        name: "description",
        content:
          "Your private desk: drop in the job description, resume and rejection email and Shanthi returns a full breakdown of why it went the other way.",
      },
      { property: "og:title", content: "Workspace — Analyse Your Rejection | On File" },
      {
        property: "og:description",
        content: "Paste or attach your three documents and get a fit score, missing skills and a comeback plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FrontDesk,
});

type Slot = "jd" | "resume" | "email";

const MAX_BYTES = 8 * 1024 * 1024;

function FrontDesk() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const analyze = useServerFn(analyzeApplication);
  const [text, setText] = useState<Record<Slot, string>>({ jd: "", resume: "", email: "" });
  const [files, setFiles] = useState<Partial<Record<Slot, { name: string; mimeType: string; dataUrl: string }>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !session) navigate({ to: "/signin", replace: true });
  }, [authLoading, session, navigate]);


  async function attach(slot: Slot, file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toast.error("That file is over 8MB — paste the text instead.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    setFiles((prev) => ({
      ...prev,
      [slot]: { name: file.name, mimeType: file.type || "application/octet-stream", dataUrl },
    }));
  }

  async function onSubmit() {
    const attached = Object.values(files).filter(Boolean) as Array<{
      name: string;
      mimeType: string;
      dataUrl: string;
    }>;
    if (!text.jd.trim() && !text.resume.trim() && !text.email.trim() && attached.length === 0) {
      toast.error("Shanthi needs at least the job description and your resume.");
      return;
    }
    setLoading(true);
    try {
      const report = await analyze({
        data: {
          jobDescription: text.jd,
          resumeText: text.resume,
          rejectionEmail: text.email,
          files: attached,
        },
      });
      saveReport(report);
      navigate({ to: "/report" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong on the analysis desk.");
    } finally {
      setLoading(false);
    }
  }

  const slots: Array<{
    key: Slot;
    label: string;
    icon: typeof Briefcase;
    placeholder: string;
    accept: string;
  }> = [
    {
      key: "jd",
      label: "Job description",
      icon: Briefcase,
      placeholder: "Paste the full job posting — responsibilities, requirements, nice-to-haves…",
      accept: ".pdf,.txt,.md,.doc,.docx,image/*",
    },
    {
      key: "resume",
      label: "Your resume",
      icon: FileText,
      placeholder: "Paste your resume text, or attach the PDF you actually sent them.",
      accept: ".pdf,.txt,.md,.doc,.docx,image/*",
    },
    {
      key: "email",
      label: "Rejection email",
      icon: Mail,
      placeholder: "Paste the rejection email, word for word — the wording matters.",
      accept: ".pdf,.txt,.md,.eml,image/*",
    },
  ];

  return (
    <OfficeShell>
      <section className="mx-auto max-w-5xl px-4 pt-10 sm:pt-16">
        <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="sticky-note inline-block -rotate-1 px-3 py-1 text-xs font-medium uppercase tracking-widest">
              Rejection post-mortem
            </span>
            <h1 className="mt-5 text-3xl leading-[1.1] sm:text-5xl">
              They said “we decided to move forward with other candidates”.
              <span className="block text-primary">Shanthi will tell you what that actually meant.</span>
            </h1>
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
            line="I've sat on the other side of that table. Show me the three documents and I'll be straight with you."
          />
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-4">
        <div className="paper-card tape-strip p-5 sm:p-8">
          <h2 className="font-display text-2xl">The intake folder</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste the text or attach a file for each one. More detail, sharper analysis.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {slots.map(({ key, label, icon: Icon, placeholder, accept }) => (
              <div key={key} className="rounded-xl border border-border bg-secondary/40 p-4">
                <Label htmlFor={key} className="flex items-center gap-2 text-sm font-semibold">
                  <span className="flex size-7 items-center justify-center rounded-md bg-folder text-folder-foreground">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </Label>
                <Textarea
                  id={key}
                  value={text[key]}
                  onChange={(e) => setText((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="mt-3 min-h-40 resize-y bg-card text-sm"
                />
                <div className="mt-3 flex items-center justify-between gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    <Upload className="size-3.5" />
                    Attach file
                    <input
                      type="file"
                      accept={accept}
                      className="hidden"
                      onChange={(e) => attach(key, e.target.files?.[0])}
                    />
                  </label>
                  {files[key] ? (
                    <span className="flex max-w-[60%] items-center gap-1 truncate rounded-full bg-note px-2 py-1 text-[11px] text-note-foreground">
                      <span className="truncate">{files[key]!.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${files[key]!.name}`}
                        onClick={() => setFiles((prev) => ({ ...prev, [key]: undefined }))}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">PDF, DOCX, TXT or a screenshot — up to 8MB each.</p>
            <Button size="lg" onClick={onSubmit} disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Shanthi is reading your file…
                </>
              ) : (
                "Open my case file"
              )}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-5xl px-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { n: "01", t: "Drop the paperwork", d: "Job description, resume, rejection email — exactly what they saw." },
            { n: "02", t: "Shanthi cross-reads it", d: "Requirements matched line by line against your actual evidence." },
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
    </OfficeShell>
  );
}
