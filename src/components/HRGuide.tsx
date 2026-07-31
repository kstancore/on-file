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
  sm: "w-24 sm:w-28",
  md: "w-40 sm:w-48",
  lg: "w-56 sm:w-72",
};

export function HRGuide({ pose = "greeting", line, className = "", size = "md", priority }: Props) {
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <img
        src={poses[pose]}
        alt="Nia, your senior recruiter guide"
        width={768}
        height={1024}
        loading={priority ? "eager" : "lazy"}
        className={`${sizes[size]} shrink-0 select-none drop-shadow-sm`}
      />
      {line ? (
        <div className="relative mb-6 max-w-xs rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-desk">
          <span className="mb-1 block font-display text-xs uppercase tracking-widest text-muted-foreground">
            Nia · Senior Recruiter
          </span>
          {line}
        </div>
      ) : null}
    </div>
  );
}
