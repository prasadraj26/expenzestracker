import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "@/lib/store";
import { format, parseISO } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
  limit?: number;
}

export function TransactionList({ transactions, onEdit, onDelete, limit }: TransactionListProps) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  const displayed = limit ? sorted.slice(0, limit) : sorted;

  if (displayed.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No transactions yet</p>;
  }

  return (
    <div className="divide-y divide-border">
      {displayed.map((tx) => (
        <div key={tx.id} className="flex items-center gap-3 py-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              tx.type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}
          >
            {tx.type === "income" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{tx.description || tx.category}</p>
            <p className="text-xs text-muted-foreground">
              {tx.category} · {format(parseISO(tx.date), "MMM d")}
            </p>
          </div>
          <p
            className={`text-sm font-semibold ${
              tx.type === "income" ? "text-success" : "text-destructive"
            }`}
          >
            {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
          </p>
          {(onEdit || onDelete) && (
            <div className="flex gap-1">
              {onEdit && (
                <button onClick={() => onEdit(tx)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(tx.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
