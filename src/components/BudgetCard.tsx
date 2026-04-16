import type { Budget, Transaction } from "@/lib/store";
import { Trash2 } from "lucide-react";

interface BudgetCardProps {
  budget: Budget;
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function BudgetCard({ budget, transactions, onDelete }: BudgetCardProps) {
  const spent = transactions
    .filter((t) => t.type === "expense" && t.category === budget.category && t.date.startsWith(budget.month))
    .reduce((s, t) => s + t.amount, 0);

  const pct = Math.min((spent / budget.limit) * 100, 100);
  const over = spent > budget.limit;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{budget.category}</h3>
        <button onClick={() => onDelete(budget.id)} className="rounded p-1 text-muted-foreground hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹{spent.toLocaleString()} spent</span>
          <span>₹{budget.limit.toLocaleString()} limit</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-all ${over ? "bg-destructive" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {over && <p className="mt-1.5 text-xs font-medium text-destructive">Over budget by ₹{(spent - budget.limit).toLocaleString()}</p>}
      </div>
    </div>
  );
}
