import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { HRGuide } from "@/components/HRGuide";
import { OfficeShell } from "@/components/OfficeShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — On File" },
      { name: "description", content: "Sign in to your On File workspace and pick up your rejection review with Shanthi." },
      { property: "og:title", content: "Sign In — On File" },
      { property: "og:description", content: "Back to your desk: sign in to open your workspace and reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (session) navigate({ to: "/workspace", replace: true });
  }, [session, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function resend() {
    if (!email || cooldown > 0) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setResending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Confirmation email sent again. Check your inbox and spam folder.");
    setCooldown(30);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (/confirm/i.test(error.message)) setNeedsConfirm(true);
      toast.error(error.message);
      return;
    }
    navigate({ to: "/workspace" });
  }


  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in didn't go through. Try email instead.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/workspace" });
  }

  return (
    <OfficeShell>
      <section className="mx-auto grid max-w-5xl items-center gap-8 px-4 pt-10 sm:pt-16 md:grid-cols-[1fr_0.9fr]">
        <div className="paper-card tape-strip p-6 sm:p-8">
          <span className="sticky-note inline-block -rotate-1 px-3 py-1 text-xs font-medium uppercase tracking-widest">
            Reception
          </span>
          <h1 className="mt-4 text-3xl">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Shanthi has your file ready.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 bg-card"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-card pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Checking you in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {needsConfirm && (
            <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-sm text-muted-foreground">
                Your email isn't confirmed yet. Check spam, or have us send the link again.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-3 w-full"
                onClick={resend}
                disabled={resending || cooldown > 0}
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Sending again…
                  </>
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : (
                  "Resend confirmation email"
                )}
              </Button>
            </div>
          )}


          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button type="button" variant="outline" size="lg" className="w-full" onClick={google}>
            Continue with Google
          </Button>

          <p className="mt-6 text-sm text-muted-foreground">
            No desk yet?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        <HRGuide
          pose="greeting"
          size="lg"
          className="justify-center md:justify-end"
          line="Welcome back. Sign in and we'll pick up exactly where we left off."
        />
      </section>
    </OfficeShell>
  );
}
