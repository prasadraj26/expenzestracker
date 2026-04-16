import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useTransactions } from "@/lib/store";
import { CategoryPieChart, CategoryLegend, MonthlyBarChart } from "@/components/DashboardCharts";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — ExpenseTracker" },
      { name: "description", content: "Analyze your spending trends and patterns" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { transactions } = useTransactions();
  const expenses = transactions.filter((t) => t.type === "expense");

  // Daily spending trend
  const dailyMap: Record<string, number> = {};
  expenses.forEach((t) => {
    dailyMap[t.date] = (dailyMap[t.date] || 0) + t.amount;
  });
  const dailyData = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" }),
      amount,
    }));

  // Top category
  const catMap: Record<string, number> = {};
  expenses.forEach((t) => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const topCategory = Object.entries(catMap).sort(([, a], [, b]) => b - a)[0];

  // Daily average
  const uniqueDays = new Set(expenses.map((t) => t.date)).size;
  const dailyAvg = uniqueDays > 0 ? expenses.reduce((s, t) => s + t.amount, 0) / uniqueDays : 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Spending insights and trends</p>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Top Category</span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground">{topCategory?.[0] ?? "—"}</p>
            <p className="text-xs text-muted-foreground">₹{topCategory?.[1]?.toLocaleString() ?? 0} spent</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Daily Average</span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground">₹{Math.round(dailyAvg).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">Active Days</span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground">{uniqueDays}</p>
            <p className="text-xs text-muted-foreground">days with expenses</p>
          </div>
        </div>

        {/* Spending trend line */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Daily Spending Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Line type="monotone" dataKey="amount" stroke="oklch(0.488 0.217 264)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown + monthly */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Category Breakdown</h2>
            <CategoryPieChart transactions={transactions} />
            <div className="mt-4">
              <CategoryLegend transactions={transactions} />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Income vs Expense</h2>
            <MonthlyBarChart transactions={transactions} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
