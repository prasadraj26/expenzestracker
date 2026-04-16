import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Transaction, TransactionType } from "@/lib/store";

interface TransactionFormProps {
  categories: { expense: string[]; income: string[] };
  onSubmit: (t: Omit<Transaction, "id">) => void;
  onCancel: () => void;
  initial?: Transaction;
}

export function TransactionForm({ categories, onSubmit, onCancel, initial }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? "expense");
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    onSubmit({ amount: parseFloat(amount), type, category, description, date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setType("expense"); setCategory(""); }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === "expense" ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => { setType("income"); setCategory(""); }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === "income" ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"
          }`}
        >
          Income
        </button>
      </div>

      <div>
        <Label>Amount (₹)</Label>
        <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
      </div>

      <div>
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {categories[type].map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Description</Label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was this for?" />
      </div>

      <div>
        <Label>Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">{initial ? "Update" : "Add"} Transaction</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
