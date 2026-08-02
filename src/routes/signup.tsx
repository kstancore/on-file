import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { HRGuide } from "@/components/HRGuide";
import { OfficeShell } from "@/components/OfficeShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your Account — On File" },
      {
        name: "description",
        content: "Set up your private On File desk so Shanthi can review your job description, resume and rejection email.",
      },
      { property: "og:title", content: "Create Your Account — On File" },
      { property: "og:description", content: "Create an account to open your workspace and get your rejection reviewed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/workspace", replace: true });
  }, [session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      setSent(true);
      return;
    }
    navigate({ to: "/workspace" });
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-up didn't go through. Try email instead.");
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
            New file
          </span>
          <h1 className="mt-4 text-3xl">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your own desk, your own documents. Nothing is shared with anyone.
          </p>

          {sent ? (
            <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-5">
              <MailCheck className="size-6 text-primary" />
              <h2 className="mt-3 font-display text-xl">Check your email</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We sent a confirmation link to {email}. Click it and Shanthi will open your workspace.
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 bg-card"
                    placeholder="Priya Raman"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
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
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 bg-card"
                    placeholder="At least 6 characters"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Setting up your desk…
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
              <Button type="button" variant="outline" size="lg" className="w-full" onClick={google}>
                Continue with Google
              </Button>
            </>
          )}

          <p className="mt-6 text-sm text-muted-foreground">
            Already have a desk?{" "}
            <Link to="/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <HRGuide
          pose="verdict"
          size="lg"
          className="justify-center md:justify-end"
          line="Set up your file and we'll get started. Bring the paperwork — all three pieces."
        />
      </section>
    </OfficeShell>
  );
}
