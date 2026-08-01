import greeting from "@/assets/hr-greeting.png";
import thinking from "@/assets/hr-thinking.png";
import verdict from "@/assets/hr-verdict.png";

const poses = { greeting, thinking, verdict } as const;

export type Pose = keyof typeof poses;

type Props = {
  pose?: Pose;
  line?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
};

const sizes = {
  sm: "w-20 sm:w-28",
  md: "w-32 sm:w-48",
  lg: "w-44 sm:w-72",
};

export function HRGuide({ pose = "greeting", line, className = "", size = "md", priority }: Props) {
  return (
    <div className={`flex flex-col items-center gap-3 sm:flex-row sm:items-end ${className}`}>
      <img
        src={poses[pose]}
        alt="Shanthi, your senior recruiter guide"
        width={768}
        height={1024}
        loading={priority ? "eager" : "lazy"}
        className={`${sizes[size]} max-w-full shrink-0 select-none drop-shadow-sm`}
      />
      {line ? (
        <div className="relative w-full max-w-xs rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-desk sm:mb-6 sm:w-64 sm:shrink-0">
          <span className="mb-1 block font-display text-xs uppercase tracking-widest text-muted-foreground">
            Shanthi · Senior Recruiter
          </span>
          {line}
        </div>
      ) : null}
    </div>
  );
}
