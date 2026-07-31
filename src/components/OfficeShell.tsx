import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Coffee, Paperclip, FolderOpen } from "lucide-react";

export function OfficeShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen paper-grid">
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FolderOpen className="size-5" />
            </span>
            <span className="font-display text-xl">On File</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Front desk
            </Link>
            <Link to="/report" className="transition-colors hover:text-foreground">
              My report
            </Link>
            <Coffee className="size-4 text-desk" aria-hidden />
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border bg-card/60">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <Paperclip className="size-3.5" aria-hidden /> On File — the rejection post-mortem desk.
          </span>
          <span>Your documents are analysed on the fly and never shared.</span>
        </div>
      </footer>
    </div>
  );
}
