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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your financial overview</p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Balance" value={`₹${balance.toLocaleString()}`} icon={Wallet} />
          <StatCard title="Income" value={`₹${totalIncome.toLocaleString()}`} icon={TrendingUp} variant="income" />
          <StatCard title="Expenses" value={`₹${totalExpense.toLocaleString()}`} icon={TrendingDown} variant="expense" />
        </div>

        {/* Charts row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Monthly Overview</h2>
            <MonthlyBarChart transactions={transactions} />
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Spending by Category</h2>
            <CategoryPieChart transactions={transactions} />
            <div className="mt-4">
              <CategoryLegend transactions={transactions} />
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
            <Link to="/transactions" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <TransactionList transactions={transactions} limit={5} />
        </div>
      </div>
    </AppShell>
  );
}
