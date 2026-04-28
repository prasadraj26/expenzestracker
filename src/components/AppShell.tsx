import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ArrowLeftRight, BarChart3, Target, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/budget", label: "Budget", icon: Target },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setShouldRedirect(true);
    }
  }, [loading, user]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate({ to: "/login" });
    }
  }, [shouldRedirect, navigate]);

  if (loading || shouldRedirect) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return "U";
  };

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      {/* Top bar - Floating Glass Header */}
      <header className="sticky top-4 z-30 mx-auto max-w-6xl px-4 mb-8">
        <div className="glass rounded-2xl flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
              <span className="text-sm font-bold text-primary-foreground">₹</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight hidden sm:block">ExpenseTracker</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden gap-2 md:flex items-center bg-background/30 p-1.5 rounded-xl border border-white/10">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 border-l border-border pl-4">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Profile">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-sm overflow-hidden border-2 border-primary/20">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-white">
                      {getInitials(user?.displayName, user?.email)}
                    </span>
                  )}
                </div>
              </Link>
              
              <button
                onClick={signOut}
                className="flex items-center justify-center h-9 w-9 rounded-full text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden flex items-center justify-center h-10 w-10 rounded-full glass hover:bg-white/10 text-foreground transition-colors" onClick={() => setOpen(!open)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="absolute top-[calc(100%+0.5rem)] left-4 right-4 bg-background/95 backdrop-blur-2xl border border-border rounded-xl p-3 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium mb-1 transition-colors ${
                    active ? "bg-primary text-primary-foreground shadow-md" : "text-foreground/80 hover:bg-accent/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
            <div className="h-px bg-border my-2 max-w-[90%] mx-auto" />
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              Profile Settings
            </Link>
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-4 relative z-10">{children}</main>
    </div>
  );
}
