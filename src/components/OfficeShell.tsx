import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Coffee, LogOut, Menu } from "lucide-react";
import logoAsset from "@/assets/on-file-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/shanthi", label: "Shanthi" },
  { to: "/workspace", label: "Workspace" },
  { to: "/report", label: "My report" },
] as const;

export function OfficeShell({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function signOut() {
    setOpen(false);
    await supabase.auth.signOut();
    navigate({ to: "/signin", replace: true });
  }

  return (
    <div className="min-h-screen paper-grid">
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src={logoAsset.url}
              alt="On File logo"
              width={36}
              height={36}
              className="size-9 shrink-0 object-contain"
            />
            <span className="truncate font-display text-lg sm:text-xl">On File</span>
          </Link>

          <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ))}
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

          <div className="flex items-center gap-2 md:hidden">
            {loading || session ? null : (
              <Button asChild size="sm">
                <Link to="/signin">Sign in</Link>
              </Button>
            )}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] max-w-xs">
                <SheetTitle className="flex items-center gap-2 font-display text-xl">
                  <img src={logoAsset.url} alt="" width={28} height={28} className="size-7 object-contain" aria-hidden />
                  On File
                </SheetTitle>
                <nav className="mt-6 flex flex-col gap-1">
                  {links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-2 py-2.5 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      activeProps={{ className: "text-foreground font-medium" }}
                    >
                      {l.label}
                    </Link>
                  ))}
                  {loading ? null : session ? (
                    <button
                      onClick={signOut}
                      className="mt-2 flex items-center gap-2 rounded-md px-2 py-2.5 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <LogOut className="size-4" /> Sign out
                    </button>
                  ) : null}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border bg-card/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <img src={logoAsset.url} alt="" width={16} height={16} className="size-4 shrink-0 object-contain" aria-hidden /> On File — the rejection post-mortem desk.
          </span>
          <span>Your documents are analysed on the fly and never shared.</span>
        </div>
      </footer>
    </div>
  );
}
