import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Coffee, Paperclip, FolderOpen, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function OfficeShell({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/signin", replace: true });
  }

  return (
    <div className="min-h-screen paper-grid">
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FolderOpen className="size-5" />
            </span>
            <span className="font-display text-xl">On File</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link to="/how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </Link>
            <Link to="/shanthi" className="transition-colors hover:text-foreground">
              Shanthi
            </Link>
            <Link to="/workspace" className="transition-colors hover:text-foreground">
              Workspace
            </Link>
            <Link to="/report" className="transition-colors hover:text-foreground">
              My report
            </Link>
            {loading ? null : session ? (
              <button onClick={signOut} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <LogOut className="size-3.5" /> Sign out
              </button>
            ) : (
              <Button asChild size="sm">
                <Link to="/signin">Sign in</Link>
              </Button>
            )}
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
