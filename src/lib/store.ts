import { useState, useCallback } from "react";

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

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: "1", amount: 5000, type: "income", category: "Salary", description: "Monthly salary", date: "2026-04-01" },
  { id: "2", amount: 45, type: "expense", category: "Food", description: "Groceries", date: "2026-04-02" },
  { id: "3", amount: 120, type: "expense", category: "Bills", description: "Electricity bill", date: "2026-04-03" },
  { id: "4", amount: 30, type: "expense", category: "Travel", description: "Uber ride", date: "2026-04-05" },
  { id: "5", amount: 200, type: "expense", category: "Shopping", description: "New shoes", date: "2026-04-07" },
  { id: "6", amount: 500, type: "income", category: "Freelance", description: "Web project", date: "2026-04-08" },
  { id: "7", amount: 15, type: "expense", category: "Entertainment", description: "Netflix", date: "2026-04-10" },
  { id: "8", amount: 80, type: "expense", category: "Food", description: "Restaurant dinner", date: "2026-04-12" },
  { id: "9", amount: 60, type: "expense", category: "Health", description: "Pharmacy", date: "2026-04-14" },
  { id: "10", amount: 250, type: "expense", category: "Education", description: "Online course", date: "2026-04-15" },
];

const DEMO_BUDGETS: Budget[] = [
  { id: "b1", category: "Food", limit: 300, month: "2026-04" },
  { id: "b2", category: "Travel", limit: 200, month: "2026-04" },
  { id: "b3", category: "Entertainment", limit: 100, month: "2026-04" },
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [...prev, { ...t, id: crypto.randomUUID() }]);
  }, []);

  const updateTransaction = useCallback((id: string, t: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, ...t } : tx)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  return { transactions, addTransaction, updateTransaction, deleteTransaction };
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(DEMO_BUDGETS);

  const addBudget = useCallback((b: Omit<Budget, "id">) => {
    setBudgets((prev) => [...prev, { ...b, id: crypto.randomUUID() }]);
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { budgets, addBudget, deleteBudget };
}

export function useCategories() {
  const [custom, setCustom] = useState<{ expense: string[]; income: string[] }>({ expense: [], income: [] });

  const allCategories = {
    expense: [...DEFAULT_CATEGORIES.expense, ...custom.expense],
    income: [...DEFAULT_CATEGORIES.income, ...custom.income],
  };

  const addCategory = useCallback((type: TransactionType, name: string) => {
    setCustom((prev) => ({ ...prev, [type]: [...prev[type], name] }));
  }, []);

  return { categories: allCategories, addCategory };
}
