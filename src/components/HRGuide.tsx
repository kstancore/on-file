import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

const poses = {
  greeting: "/characters/hr-greeting.webp",
  thinking: "/characters/hr-thinking.webp",
  verdict: "/characters/hr-verdict.webp",
  interview: "/characters/hr-interview.webp",
} as const;

export type Pose = keyof typeof poses;

type Props = {
  pose?: Pose;
  line?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  layout?: "standard" | "compact";
};

const sizes = {
  sm: "w-24 sm:w-32",
  md: "w-36 sm:w-52",
  lg: "w-52 sm:w-80",
};

export function HRGuide({
  pose = "greeting",
  line,
  className = "",
  size = "md",
  priority,
  layout = "standard",
}: Props) {
  const [expanded, setExpanded] = useState(false);

  if (layout === "compact") {
    return (
      <aside className={`w-full ${className}`} aria-label="Shanthi, your senior recruiter guide">
        <div className="flex min-h-20 items-center gap-3 rounded-lg border border-border bg-card p-2 shadow-desk transition-colors hover:border-primary/45">
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-secondary sm:h-[4.5rem] sm:w-24">
            <img
              src={poses[pose]}
              alt="Shanthi seated at her recruitment desk"
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              className="h-full w-full object-cover object-[50%_35%]"
            />
            <span className="absolute bottom-1 right-1 size-2.5 rounded-full border-2 border-card bg-success" aria-hidden />
          </div>

          <div className="min-w-0 flex-1">
            <span className="block font-sans text-[10px] font-bold uppercase tracking-widest text-primary">
              Shanthi · Senior Recruiter
            </span>
            <p className={`mt-1 text-xs leading-relaxed text-card-foreground ${expanded ? "" : "line-clamp-2"}`}>
              {line}
            </p>
          </div>

          {line ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-full"
              aria-label={expanded ? "Collapse Shanthi's note" : "Expand Shanthi's note"}
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              <ChevronDown className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
            </Button>
          ) : null}
        </div>
      </aside>
    );
  }

  return (
    <div className={`group flex flex-col items-center gap-3 sm:flex-row sm:items-end ${className}`}>
      <div className={`relative shrink-0 ${sizes[size]} max-w-full`}>
        {/* desk spotlight behind her so she never reads as washed out */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[6%] top-[4%] rounded-[45%] bg-primary/12 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[12%] bottom-[2%] h-3 rounded-[50%] bg-foreground/20 blur-md"
        />
        <img
          src={poses[pose]}
          alt="Shanthi, your senior recruiter guide"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className="desk-float relative block h-auto w-full select-none object-contain drop-shadow-[0_10px_18px_color-mix(in_oklab,var(--foreground)_22%,transparent)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03]"
        />
      </div>
      {line ? (
        <div className="relative w-full max-w-xs rounded-2xl rounded-bl-sm border-2 border-primary/25 bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-desk sm:mb-8 sm:w-64 sm:shrink-0">
          <span
            aria-hidden
            className="absolute -bottom-[9px] left-6 size-4 rotate-45 border-b-2 border-r-2 border-primary/25 bg-card sm:-left-[9px] sm:bottom-6 sm:rotate-[135deg]"
          />
          <span className="mb-1 flex items-center gap-1.5 font-display text-xs uppercase tracking-widest text-primary">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary" />
            Shanthi · Senior Recruiter
          </span>
          {line}
        </div>
      ) : null}
    </div>
  );
}
