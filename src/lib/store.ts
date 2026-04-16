import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string; // YYYY-MM
}

export const DEFAULT_CATEGORIES = {
  expense: ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Health", "Education", "Other"],
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
};

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("transactions")
      .select("id, amount, type, category, description, date")
      .order("date", { ascending: false });
    if (data) {
      setTransactions(
        data.map((t) => ({
          ...t,
          type: t.type as TransactionType,
          amount: Number(t.amount),
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(
    async (t: Omit<Transaction, "id">) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...t, user_id: user.id })
        .select("id, amount, type, category, description, date")
        .single();
      if (data && !error) {
        setTransactions((prev) => [
          { ...data, type: data.type as TransactionType, amount: Number(data.amount) },
          ...prev,
        ]);
      }
    },
    [user]
  );

  const updateTransaction = useCallback(
    async (id: string, t: Partial<Transaction>) => {
      if (!user) return;
      const { error } = await supabase.from("transactions").update(t).eq("id", id);
      if (!error) {
        setTransactions((prev) =>
          prev.map((tx) => (tx.id === id ? { ...tx, ...t } : tx))
        );
      }
    },
    [user]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      if (!user) return;
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (!error) {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      }
    },
    [user]
  );

  return { transactions, loading, addTransaction, updateTransaction, deleteTransaction };
}

export function useBudgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("budgets")
      .select("id, category, limit, month")
      .order("created_at", { ascending: false });
    if (data) {
      setBudgets(data.map((b) => ({ ...b, limit: Number(b.limit) })));
    }
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = useCallback(
    async (b: Omit<Budget, "id">) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("budgets")
        .insert({ ...b, user_id: user.id })
        .select("id, category, limit, month")
        .single();
      if (data && !error) {
        setBudgets((prev) => [{ ...data, limit: Number(data.limit) }, ...prev]);
      }
    },
    [user]
  );

  const deleteBudget = useCallback(
    async (id: string) => {
      if (!user) return;
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (!error) {
        setBudgets((prev) => prev.filter((b) => b.id !== id));
      }
    },
    [user]
  );

  return { budgets, addBudget, deleteBudget };
}

export function useCategories() {
  const [custom, setCustom] = useState<{ expense: string[]; income: string[] }>({
    expense: [],
    income: [],
  });

  const allCategories = {
    expense: [...DEFAULT_CATEGORIES.expense, ...custom.expense],
    income: [...DEFAULT_CATEGORIES.income, ...custom.income],
  };

  const addCategory = useCallback((type: TransactionType, name: string) => {
    setCustom((prev) => ({ ...prev, [type]: [...prev[type], name] }));
  }, []);

  return { categories: allCategories, addCategory };
}
