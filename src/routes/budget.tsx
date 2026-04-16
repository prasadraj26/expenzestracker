import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { BudgetCard } from "@/components/BudgetCard";
import { useTransactions, useBudgets, DEFAULT_CATEGORIES } from "@/lib/store";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title: "Budget — ExpenseTracker" },
      { name: "description", content: "Set and track your monthly budgets" },
    ],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const { transactions } = useTransactions();
  const { budgets, addBudget, deleteBudget } = useBudgets();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const currentMonth = new Date().toISOString().slice(0, 7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limit) return;
    addBudget({ category, limit: parseFloat(limit), month: currentMonth });
    setShowForm(false);
    setCategory("");
    setLimit("");
  };

  // Total budget usage
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalBudgeted = budgets.reduce((s, b) => {
    const spent = transactions
      .filter((t) => t.type === "expense" && t.category === b.category && t.date.startsWith(b.month))
      .reduce((sum, t) => sum + t.amount, 0);
    return s + spent;
  }, 0);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Budget</h1>
            <p className="text-sm text-muted-foreground">
              ₹{totalBudgeted.toLocaleString()} of ₹{totalBudget.toLocaleString()} used
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Budget
          </Button>
        </div>

        {/* Overall progress */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Overall Budget Usage</span>
            <span>{totalBudget > 0 ? Math.round((totalBudgeted / totalBudget) * 100) : 0}%</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all ${totalBudgeted > totalBudget ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${totalBudget > 0 ? Math.min((totalBudgeted / totalBudget) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">New Budget</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.expense.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Monthly Limit (₹)</Label>
                <Input type="number" min="0" step="1" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="0" required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Set Budget</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {/* Budget cards */}
        {budgets.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">No budgets set. Create one to start tracking.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {budgets.map((b) => (
              <BudgetCard key={b.id} budget={b} transactions={transactions} onDelete={deleteBudget} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
