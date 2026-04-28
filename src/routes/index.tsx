import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { TransactionList } from "@/components/TransactionList";
import { CategoryPieChart, CategoryLegend, MonthlyBarChart } from "@/components/DashboardCharts";
import { useTransactions, useBudgets, useCategories } from "@/lib/store";
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ExpenseTracker" },
      { name: "description", content: "Track your expenses and income with smart analytics" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { transactions } = useTransactions();
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="glass-card p-6 border-l-4 border-l-primary flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight text-glow">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Your financial overview</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Today</p>
            <p className="text-sm font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Balance" value={`₹${balance.toLocaleString()}`} icon={Wallet} />
          <StatCard title="Income" value={`₹${totalIncome.toLocaleString()}`} icon={TrendingUp} variant="income" />
          <StatCard title="Expenses" value={`₹${totalExpense.toLocaleString()}`} icon={TrendingDown} variant="expense" />
        </div>

        {/* Charts row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card p-6 border-t-2 border-t-primary/50">
            <h2 className="mb-6 text-base font-semibold text-foreground tracking-wide">Monthly Overview</h2>
            <MonthlyBarChart transactions={transactions} />
          </div>
          <div className="glass-card p-6 border-t-2 border-t-accent/50">
            <h2 className="mb-6 text-base font-semibold text-foreground tracking-wide">Spending by Category</h2>
            <CategoryPieChart transactions={transactions} />
            <div className="mt-4">
              <CategoryLegend transactions={transactions} />
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="glass-card p-6 border-t-2 border-t-secondary/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-foreground tracking-wide">Recent Transactions</h2>
            <Link to="/transactions" className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <TransactionList transactions={transactions} limit={5} />
        </div>
      </div>
    </AppShell>
  );
}
