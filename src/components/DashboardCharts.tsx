import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Transaction } from "@/lib/store";

const COLORS = [
  "oklch(0.488 0.217 264)",
  "oklch(0.62 0.18 250)",
  "oklch(0.38 0.15 264)",
  "oklch(0.72 0.12 250)",
  "oklch(0.55 0.2 280)",
  "oklch(0.45 0.15 230)",
  "oklch(0.65 0.1 264)",
  "oklch(0.50 0.18 290)",
];

export function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const byCategory: Record<string, number> = {};
  expenses.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });
  const data = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  if (data.length === 0) return <p className="py-8 text-center text-sm text-muted-foreground">No expense data</p>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3} strokeWidth={0}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `₹${Number(value).toLocaleString()}`}
          contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CategoryLegend({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const byCategory: Record<string, number> = {};
  expenses.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });
  const data = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-foreground">{d.name}</span>
          </div>
          <span className="font-medium text-foreground">₹{d.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyBarChart({ transactions }: { transactions: Transaction[] }) {
  const monthMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const m = t.date.slice(0, 7);
    if (!monthMap[m]) monthMap[m] = { income: 0, expense: 0 };
    monthMap[m][t.type] += t.amount;
  });

  const data = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month: new Date(month + "-01").toLocaleDateString("en", { month: "short" }),
      Income: v.income,
      Expense: v.expense,
    }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)" }} />
        <Bar dataKey="Income" fill="oklch(0.55 0.18 155)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expense" fill="oklch(0.488 0.217 264)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
