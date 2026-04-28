import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User as UserIcon, Save } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — ExpenseTracker" },
      { name: "description", content: "Manage your user profile" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return "U";
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-glow">User Profile</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage your account settings and preferences.</p>
        </div>

        <div className="glass-card p-8 border-t-4 border-t-primary">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar section */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg transform transition hover:scale-105 duration-300">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-primary-foreground">
                    {getInitials(user?.displayName, user?.email)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Member since <br /> {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'recently'}
              </p>
            </div>

            {/* Form section */}
            <div className="flex-1 w-full space-y-6">
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-success/50 bg-success/10 px-4 py-3 text-sm text-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80">Email Address (Read Only)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="bg-muted/50 text-muted-foreground glass border-white/20"
                  />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Account ID: {user?.uid}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-foreground/80">Display Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="displayName"
                      className="pl-10 glass border-white/20 focus:border-primary transition-colors"
                      placeholder="e.g. John Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
