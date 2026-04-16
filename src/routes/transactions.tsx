import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { useTransactions, useCategories, type Transaction } from "@/lib/store";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — ExpenseTracker" },
      { name: "description", content: "Manage your income and expense transactions" },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
            <p className="text-sm text-muted-foreground">{transactions.length} total</p>
          </div>
          <Button onClick={() => { setEditing(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        {/* Form dialog */}
        {showForm && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">{editing ? "Edit" : "New"} Transaction</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <TransactionForm
              categories={categories}
              initial={editing ?? undefined}
              onSubmit={(t) => {
                if (editing) updateTransaction(editing.id, t);
                else addTransaction(t);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {(["all", "income", "expense"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="rounded-xl border border-border bg-card p-5">
          <TransactionList
            transactions={filtered}
            onEdit={(t) => { setEditing(t); setShowForm(true); }}
            onDelete={deleteTransaction}
          />
        </div>
      </div>
    </AppShell>
  );
}
