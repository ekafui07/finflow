import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Budget, SavingsGoal, UserProfile, Bill } from './types';
import { auth, db } from './config/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  writeBatch,
  getDocFromServer
} from 'firebase/firestore';

interface AppContextType {
  user: UserProfile | null;
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  bills: Bill[];
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  dismissedAlerts: string[];
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, updated: Partial<Transaction>) => Promise<void>;
  addBudget: (b: Omit<Budget, 'id'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  updateBudget: (id: string, updated: Partial<Budget>) => Promise<void>;
  addGoal: (g: Omit<SavingsGoal, 'id'>) => Promise<void>;
  updateGoal: (id: string, updated: Partial<SavingsGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addBill: (b: Omit<Bill, 'id'>) => Promise<void>;
  toggleBillPaid: (id: string) => Promise<void>;
  applyBudgetTemplate: (template: Omit<Budget, 'id'>[]) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  dismissAlert: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Connection test
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, '_connection_test_', 'ping'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Firebase is offline. Check your configuration or internet connection.");
        }
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
      if (!u) {
        setUser(null);
        setTransactions([]);
        setBudgets([]);
        setGoals([]);
        setBills([]);
        setHasCompletedOnboarding(false);
        setDismissedAlerts([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;

    setIsLoading(true);
    const userId = firebaseUser.uid;

    // Listen to Profile
    const unsubProfile = onSnapshot(doc(db, 'users', userId, 'profile', 'data'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setUser(data);
        setHasCompletedOnboarding(data.onboardingComplete || false);
      } else {
        // Initialize profile if it doesn't exist
        const initialProfile: UserProfile = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          currency: 'GHS',
          incomeFrequency: 'monthly',
          monthlyIncome: 1000,
          financialGoals: [],
          theme: 'light',
          onboardingComplete: false
        };
        setDoc(doc(db, 'users', userId, 'profile', 'data'), initialProfile);
      }
    }, (error) => handleFirestoreError(error, 'get', `users/${userId}/profile/data`));

    // Listen to Transactions
    const unsubTransactions = onSnapshot(
      query(collection(db, 'users', userId, 'transactions'), orderBy('date', 'desc')),
      (snapshot) => {
        setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
      }, (error) => handleFirestoreError(error, 'list', `users/${userId}/transactions`)
    );

    // Listen to Budgets
    const unsubBudgets = onSnapshot(collection(db, 'users', userId, 'budgets'), (snapshot) => {
      setBudgets(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Budget)));
    }, (error) => handleFirestoreError(error, 'list', `users/${userId}/budgets`));

    // Listen to Goals
    const unsubGoals = onSnapshot(collection(db, 'users', userId, 'goals'), (snapshot) => {
      setGoals(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SavingsGoal)));
    }, (error) => handleFirestoreError(error, 'list', `users/${userId}/goals`));

    // Listen to Bills
    const unsubBills = onSnapshot(collection(db, 'users', userId, 'bills'), (snapshot) => {
      setBills(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Bill)));
    }, (error) => handleFirestoreError(error, 'list', `users/${userId}/bills`));

    // Listen to Dismissed Alerts
    const unsubAlerts = onSnapshot(collection(db, 'users', userId, 'alerts'), (snapshot) => {
      setDismissedAlerts(snapshot.docs.map(d => d.id));
      setIsLoading(false);
    }, (error) => handleFirestoreError(error, 'list', `users/${userId}/alerts`));

    return () => {
      unsubProfile();
      unsubTransactions();
      unsubBudgets();
      unsubGoals();
      unsubBills();
      unsubAlerts();
    };
  }, [firebaseUser]);

  const handleFirestoreError = (error: any, operation: string, path: string) => {
    const errInfo = {
      error: error.message,
      operationType: operation,
      path,
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      }
    };
    console.error('Firestore Error:', JSON.stringify(errInfo));
    // You could show a toast here
  };

  const login = async (email: string, password?: string) => {
    // For demo purposes, we might use a default password if not provided
    await signInWithEmailAndPassword(auth, email, password || 'password123');
  };

  const signup = async (email: string, password: string, name: string) => {
    const { user: u } = await createUserWithEmailAndPassword(auth, email, password);
    const initialProfile: UserProfile = {
      name,
      email,
      currency: 'GHS',
      incomeFrequency: 'monthly',
      monthlyIncome: 1000,
      financialGoals: [],
      theme: 'light',
      onboardingComplete: false
    };
    await setDoc(doc(db, 'users', u.uid, 'profile', 'data'), initialProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    if (!firebaseUser) return;
    const userId = firebaseUser.uid;
    
    try {
      await addDoc(collection(db, 'users', userId, 'transactions'), t);
      
      // Update budget spent amount if it's an expense
      if (t.type === 'expense') {
        const budget = budgets.find(b => b.category === t.category);
        if (budget) {
          await updateDoc(doc(db, 'users', userId, 'budgets', budget.id), {
            spent: budget.spent + t.amount
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${userId}/transactions`);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!firebaseUser) return;
    const userId = firebaseUser.uid;
    const t = transactions.find(item => item.id === id);
    
    try {
      await deleteDoc(doc(db, 'users', userId, 'transactions', id));
      
      if (t && t.type === 'expense') {
        const budget = budgets.find(b => b.category === t.category);
        if (budget) {
          await updateDoc(doc(db, 'users', userId, 'budgets', budget.id), {
            spent: Math.max(0, budget.spent - t.amount)
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, 'delete', `users/${userId}/transactions/${id}`);
    }
  };

  const updateTransaction = async (id: string, updated: Partial<Transaction>) => {
    if (!firebaseUser) return;
    const userId = firebaseUser.uid;
    const old = transactions.find(t => t.id === id);
    if (!old) return;

    try {
      await updateDoc(doc(db, 'users', userId, 'transactions', id), updated);

      // Handle budget updates if amount or category changed
      if (old.type === 'expense' || updated.type === 'expense') {
        const current = { ...old, ...updated };
        
        // This is a bit complex for a simple update, but necessary for consistency
        // In a real app, you might use a Cloud Function to keep these in sync
        for (const b of budgets) {
          let newSpent = b.spent;
          if (old.type === 'expense' && b.category === old.category) {
            newSpent -= old.amount;
          }
          if (current.type === 'expense' && b.category === current.category) {
            newSpent += current.amount;
          }
          if (newSpent !== b.spent) {
            await updateDoc(doc(db, 'users', userId, 'budgets', b.id), { spent: Math.max(0, newSpent) });
          }
        }
      }
    } catch (error) {
      handleFirestoreError(error, 'update', `users/${userId}/transactions/${id}`);
    }
  };

  const addBudget = async (b: Omit<Budget, 'id'>) => {
    if (!firebaseUser) return;
    await addDoc(collection(db, 'users', firebaseUser.uid, 'budgets'), b);
  };

  const deleteBudget = async (id: string) => {
    if (!firebaseUser) return;
    await deleteDoc(doc(db, 'users', firebaseUser.uid, 'budgets', id));
  };

  const updateBudget = async (id: string, updated: Partial<Budget>) => {
    if (!firebaseUser) return;
    await updateDoc(doc(db, 'users', firebaseUser.uid, 'budgets', id), updated);
  };

  const addGoal = async (g: Omit<SavingsGoal, 'id'>) => {
    if (!firebaseUser) return;
    await addDoc(collection(db, 'users', firebaseUser.uid, 'goals'), g);
  };

  const updateGoal = async (id: string, updated: Partial<SavingsGoal>) => {
    if (!firebaseUser) return;
    await updateDoc(doc(db, 'users', firebaseUser.uid, 'goals', id), updated);
  };

  const deleteGoal = async (id: string) => {
    if (!firebaseUser) return;
    await deleteDoc(doc(db, 'users', firebaseUser.uid, 'goals', id));
  };

  const addBill = async (b: Omit<Bill, 'id'>) => {
    if (!firebaseUser) return;
    await addDoc(collection(db, 'users', firebaseUser.uid, 'bills'), b);
  };

  const toggleBillPaid = async (id: string) => {
    if (!firebaseUser) return;
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    const newIsPaid = !bill.isPaid;
    await updateDoc(doc(db, 'users', firebaseUser.uid, 'bills', id), { isPaid: newIsPaid });

    if (newIsPaid) {
      await addTransaction({
        date: new Date().toISOString().split('T')[0],
        amount: bill.amount,
        category: bill.category,
        description: `Bill Payment: ${bill.name}`,
        type: 'expense'
      });
    }
  };

  const applyBudgetTemplate = async (template: Omit<Budget, 'id'>[]) => {
    if (!firebaseUser) return;
    const userId = firebaseUser.uid;
    const batch = writeBatch(db);
    
    template.forEach(b => {
      const newDoc = doc(collection(db, 'users', userId, 'budgets'));
      batch.set(newDoc, b);
    });
    
    batch.update(doc(db, 'users', userId, 'profile', 'data'), { onboardingComplete: true });
    await batch.commit();
  };

  const completeOnboarding = async () => {
    if (!firebaseUser) return;
    await updateDoc(doc(db, 'users', firebaseUser.uid, 'profile', 'data'), { onboardingComplete: true });
  };

  const dismissAlert = async (id: string) => {
    if (!firebaseUser) return;
    await setDoc(doc(db, 'users', firebaseUser.uid, 'alerts', id), { dismissedAt: new Date().toISOString() });
  };

  return (
    <AppContext.Provider value={{
      user, transactions, budgets, goals, bills, isLoading,
      hasCompletedOnboarding, dismissedAlerts,
      login, signup, logout, addTransaction, deleteTransaction, updateTransaction,
      addBudget, deleteBudget, updateBudget, addGoal, updateGoal, deleteGoal,
      addBill, toggleBillPaid, applyBudgetTemplate, completeOnboarding, dismissAlert
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
