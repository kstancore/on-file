import greeting from "@/assets/hr-greeting.webp";
import thinking from "@/assets/hr-thinking.webp";
import verdict from "@/assets/hr-verdict.webp";
import interview from "@/assets/hr-interview.webp";

const poses = { greeting, thinking, verdict, interview } as const;

export type Pose = keyof typeof poses;

type Props = {
  pose?: Pose;
  line?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
};

const sizes = {
  sm: "w-24 sm:w-32",
  md: "w-36 sm:w-52",
  lg: "w-52 sm:w-80",
};

export function HRGuide({ pose = "greeting", line, className = "", size = "md", priority }: Props) {
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
          width={800}
          height={800}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className="desk-float relative w-full select-none contrast-[1.08] saturate-[1.12] drop-shadow-[0_10px_18px_color-mix(in_oklab,var(--foreground)_22%,transparent)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03]"
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
