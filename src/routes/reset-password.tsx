import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { OfficeShell } from "@/components/OfficeShell";
import { HRGuide } from "@/components/HRGuide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search["mode"] === "request" ? ("request" as const) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Reset Password — On File" },
      { name: "description", content: "Recover access to your private On File workspace." },
      { property: "og:title", content: "Reset Password — On File" },
      { property: "og:description", content: "Recover access to your private On File workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const { mode } = Route.useSearch();
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isRecoveryLink = window.location.hash.includes("type=recovery");
    if (isRecoveryLink) setRecoveryReady(true);
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const requestMode = mode === "request" && !recoveryReady;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (requestMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent. Check your inbox and spam folder.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. Your workspace is ready.");
      await navigate({ to: "/workspace", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Password recovery failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OfficeShell>
      <section className="mx-auto grid max-w-5xl items-center gap-8 px-4 pt-10 sm:pt-16 md:grid-cols-[1fr_0.9fr]">
        <div className="paper-card tape-strip p-6 sm:p-8">
          <span className="sticky-note inline-block -rotate-1 px-3 py-1 text-xs font-medium uppercase tracking-widest">Account help</span>
          <h1 className="mt-4 text-3xl">{requestMode ? "Reset your password" : "Choose a new password"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {requestMode ? "We'll send a secure recovery link to your email." : "Use at least 6 characters for your new password."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {requestMode ? (
              <div>
                <Label htmlFor="recovery-email">Email</Label>
                <Input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 bg-card" placeholder="you@example.com" />
              </div>
            ) : (
              <div>
                <Label htmlFor="new-password">New password</Label>
                <div className="relative mt-1.5">
                  <Input id="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-card pr-10" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 h-full text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="size-4 animate-spin" /> Please wait…</> : requestMode ? "Send reset link" : "Update password"}
            </Button>
          </form>
          <Link to="/signin" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Back to sign in</Link>
        </div>
        <HRGuide pose="greeting" size="lg" className="justify-center md:justify-end" line="Locked out? No worry. We'll get your account back in order." />
      </section>
    </OfficeShell>
  );
}