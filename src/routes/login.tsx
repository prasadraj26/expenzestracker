import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — ExpenseTracker" },
      { name: "description", content: "Sign in to your expense tracker account" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  if (!authLoading && user) {
    navigate({ to: "/" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "signup") {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess("Account created! Check your email to confirm, then log in.");
        setMode("login");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate({ to: "/" });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-secondary/20 px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px] pointer-events-none" />

      <div className="glass-card p-8 md:p-10 w-full max-w-md space-y-8 relative z-10 border-t-2 border-t-primary/50 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 transform transition hover:scale-105">
            <span className="text-xl font-bold text-primary-foreground">₹</span>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-foreground tracking-tight text-glow">ExpenseTracker</h1>
          <p className="text-sm font-medium text-muted-foreground">
            {mode === "login" ? "Welcome back! Please sign in." : "Create your new account today."}
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-success/50 bg-success/10 px-4 py-3 text-sm font-medium text-success animate-in fade-in slide-in-from-top-2">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80 font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="glass border-white/20 focus:border-primary transition-colors py-6"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="glass border-white/20 focus:border-primary transition-colors py-6"
              required
            />
          </div>
          <Button type="submit" className="w-full gap-2 py-6 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20" disabled={loading}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : mode === "login" ? (
              <LogIn className="h-5 w-5" />
            ) : (
              <UserPlus className="h-5 w-5" />
            )}
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm font-medium text-muted-foreground pt-2">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
            className="text-primary hover:text-primary/80 transition-colors hover:underline font-bold"
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
