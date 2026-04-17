import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  onSnapshot
} from "firebase/firestore";

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

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "transactions"),
      where("user_id", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        amount: Number(doc.data().amount)
      })) as Transaction[];
      setTransactions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTransaction = useCallback(
    async (t: Omit<Transaction, "id">) => {
      if (!user) return;
      try {
        await addDoc(collection(db, "transactions"), {
          ...t,
          user_id: user.uid,
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error adding transaction: ", error);
      }
    },
    [user]
  );

  const updateTransaction = useCallback(
    async (id: string, t: Partial<Transaction>) => {
      if (!user) return;
      try {
        const docRef = doc(db, "transactions", id);
        await updateDoc(docRef, t);
      } catch (error) {
        console.error("Error updating transaction: ", error);
      }
    },
    [user]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      if (!user) return;
      try {
        await deleteDoc(doc(db, "transactions", id));
      } catch (error) {
        console.error("Error deleting transaction: ", error);
      }
    },
    [user]
  );

  return { transactions, loading, addTransaction, updateTransaction, deleteTransaction };
}

export function useBudgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    if (!user) {
      setBudgets([]);
      return;
    }

    // Creating index for 'created_at' orderBy might be needed in firestore console,
    // dropping orderBy here to avoid manual indexing steps for the user unless requested
    const q = query(
      collection(db, "budgets"),
      where("user_id", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        limit: Number(doc.data().limit)
      })) as Budget[];
      setBudgets(data);
    }, (error) => {
      console.error("Error fetching budgets: ", error);
    });

    return () => unsubscribe();
  }, [user]);

  const addBudget = useCallback(
    async (b: Omit<Budget, "id">) => {
      if (!user) return;
      try {
        await addDoc(collection(db, "budgets"), {
          ...b,
          user_id: user.uid,
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error adding budget: ", error);
      }
    },
    [user]
  );

  const deleteBudget = useCallback(
    async (id: string) => {
      if (!user) return;
      try {
        await deleteDoc(doc(db, "budgets", id));
      } catch (error) {
        console.error("Error deleting budget: ", error);
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
