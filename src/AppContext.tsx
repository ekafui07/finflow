import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, Budget, SavingsGoal, UserProfile, Bill, AppNotification } from './types';
import { auth, db } from './config/firebase';
import { isAfter, parseISO, addDays, isBefore, isSameMonth } from 'date-fns';
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
import toast from 'react-hot-toast';

interface AppContextType {
  user: UserProfile | null;
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  bills: Bill[];
  notifications: AppNotification[];
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  dismissedAlerts: string[];
  login: (email: string, password: string) => Promise<void>;
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
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const handleFirestoreError = useCallback((error: any, operation: string, path: string) => {
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
    toast.error(`Error during ${operation}: ${error.message}`);
  }, []);

  // Connection test
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, '_connection_test_', 'ping'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client client is offline')) {
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
        setNotifications([]);
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
        const initialProfile: UserProfile = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          currency: 'GHS',
          incomeFrequency: 'monthly',
          monthlyIncome: 1000,
          financialGoals: [],
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

    // Listen to Notifications
    const unsubNotifications = onSnapshot(
      query(collection(db, 'users', userId, 'notifications'), orderBy('date', 'desc')),
      (snapshot) => {
        setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification)));
      }, (error) => handleFirestoreError(error, 'list', `users/${userId}/notifications`)
    );

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
      unsubNotifications();
      unsubAlerts();
    };
  }, [firebaseUser, handleFirestoreError]);

  // Smart Notification Generator
  useEffect(() => {
    if (!firebaseUser || isLoading) return;
    const userId = firebaseUser.uid;

    const generateNotifications = async () => {
      const newNotifications: Omit<AppNotification, 'id'>[] = [];

      // 1. Bill Reminders (Due within 3 days)
      bills.forEach(bill => {
        if (!bill.isPaid) {
          const dueDate = parseISO(bill.dueDate);
          const threeDaysFromNow = addDays(new Date(), 3);
          if (isBefore(dueDate, threeDaysFromNow)) {
            const exists = notifications.some(n => n.type === 'bill' && n.message.includes(bill.name));
            if (!exists) {
              newNotifications.push({
                title: 'Bill Reminder',
                message: `Your ${bill.name} bill (${bill.amount}) is due on ${bill.dueDate}.`,
                type: 'bill',
                date: new Date().toISOString(),
                isRead: false,
                link: '/transactions'
              });
            }
          }
        }
      });

      // 2. Budget Alerts (Over 80% spent)
      budgets.forEach(budget => {
        const percent = (budget.spent / budget.limit) * 100;
        if (percent >= 80) {
          const exists = notifications.some(n => n.type === 'budget' && n.message.includes(budget.category));
          if (!exists) {
            newNotifications.push({
              title: 'Budget Alert',
              message: `You've spent ${Math.round(percent)}% of your ${budget.category} budget.`,
              type: 'budget',
              date: new Date().toISOString(),
              isRead: false,
              link: '/budgets'
            });
          }
        }
      });

      // 3. Goal Milestones (Over 50% or 90%)
      goals.forEach(goal => {
        const percent = (goal.currentAmount / goal.targetAmount) * 100;
        if (percent >= 50) {
          const exists = notifications.some(n => n.type === 'goal' && n.message.includes(goal.name));
          if (!exists) {
            newNotifications.push({
              title: 'Goal Milestone!',
              message: `You're ${Math.round(percent)}% of the way to your ${goal.name} goal!`,
              type: 'goal',
              date: new Date().toISOString(),
              isRead: false,
              link: '/budgets'
            });
          }
        }
      });

      if (newNotifications.length > 0) {
        const batch = writeBatch(db);
        newNotifications.forEach(n => {
          const newDoc = doc(collection(db, 'users', userId, 'notifications'));
          batch.set(newDoc, n);
        });
        await batch.commit();
      }
    };

    generateNotifications();
  }, [firebaseUser, bills, budgets, goals, isLoading]);

  const markNotificationAsRead = async (id: string) => {
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid, 'notifications', id), { isRead: true });
    } catch (error) {
      handleFirestoreError(error, 'update', `users/${firebaseUser.uid}/notifications/${id}`);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { user: u } = await createUserWithEmailAndPassword(auth, email, password);
      const initialProfile: UserProfile = {
        name,
        email,
        currency: 'GHS',
        incomeFrequency: 'monthly',
        monthlyIncome: 1000,
        financialGoals: [],
        onboardingComplete: false
      };
      await setDoc(doc(db, 'users', u.uid, 'profile', 'data'), initialProfile);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid, 'profile', 'data'), updated);
      toast.success('Profile updated!');
    } catch (error: any) {
      handleFirestoreError(error, 'update', `users/${firebaseUser.uid}/profile/data`);
    }
  };

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    if (!firebaseUser) return;
    const userId = firebaseUser.uid;
    
    try {
      await addDoc(collection(db, 'users', userId, 'transactions'), t);
      
      if (t.type === 'expense') {
        const budget = budgets.find(b => b.category === t.category);
        if (budget) {
          await updateDoc(doc(db, 'users', userId, 'budgets', budget.id), {
            spent: budget.spent + t.amount
          });
        }
      }
      toast.success('Transaction added!');
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
      toast.success('Transaction deleted');
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

      const current = { ...old, ...updated };
      
      // If amount, category, or type changed, we need to update budgets
      if (old.amount !== current.amount || old.category !== current.category || old.type !== current.type) {
        // 1. Revert old transaction's impact on budget
        if (old.type === 'expense') {
          const oldBudget = budgets.find(b => b.category === old.category);
          if (oldBudget) {
            await updateDoc(doc(db, 'users', userId, 'budgets', oldBudget.id), {
              spent: Math.max(0, oldBudget.spent - old.amount)
            });
          }
        }

        // 2. Apply new transaction's impact on budget
        if (current.type === 'expense') {
          // We need to fetch the LATEST budget state because the previous updateDoc might have changed it
          // However, since we are in a listener, 'budgets' state might be stale if multiple updates happen fast.
          // For simplicity in this prototype, we'll use the current state, but a transaction/batch would be better.
          const newBudget = budgets.find(b => b.category === current.category);
          if (newBudget) {
            // If it's the same budget, we need to account for the reversion we just did
            const adjustedSpent = (old.type === 'expense' && old.category === current.category) 
              ? Math.max(0, newBudget.spent - old.amount) 
              : newBudget.spent;
            
            await updateDoc(doc(db, 'users', userId, 'budgets', newBudget.id), {
              spent: adjustedSpent + current.amount
            });
          }
        }
      }
      toast.success('Transaction updated');
    } catch (error) {
      handleFirestoreError(error, 'update', `users/${userId}/transactions/${id}`);
    }
  };

  const addBudget = async (b: Omit<Budget, 'id'>) => {
    if (!firebaseUser) return;
    try {
      await addDoc(collection(db, 'users', firebaseUser.uid, 'budgets'), b);
      toast.success('Budget created!');
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${firebaseUser.uid}/budgets`);
    }
  };

  const deleteBudget = async (id: string) => {
    if (!firebaseUser) return;
    try {
      await deleteDoc(doc(db, 'users', firebaseUser.uid, 'budgets', id));
      toast.success('Budget deleted');
    } catch (error) {
      handleFirestoreError(error, 'delete', `users/${firebaseUser.uid}/budgets/${id}`);
    }
  };

  const updateBudget = async (id: string, updated: Partial<Budget>) => {
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid, 'budgets', id), updated);
      toast.success('Budget updated');
    } catch (error) {
      handleFirestoreError(error, 'update', `users/${firebaseUser.uid}/budgets/${id}`);
    }
  };

  const addGoal = async (g: Omit<SavingsGoal, 'id'>) => {
    if (!firebaseUser) return;
    try {
      await addDoc(collection(db, 'users', firebaseUser.uid, 'goals'), g);
      toast.success('Goal added!');
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${firebaseUser.uid}/goals`);
    }
  };

  const updateGoal = async (id: string, updated: Partial<SavingsGoal>) => {
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid, 'goals', id), updated);
      toast.success('Goal updated');
    } catch (error) {
      handleFirestoreError(error, 'update', `users/${firebaseUser.uid}/goals/${id}`);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!firebaseUser) return;
    try {
      await deleteDoc(doc(db, 'users', firebaseUser.uid, 'goals', id));
      toast.success('Goal deleted');
    } catch (error) {
      handleFirestoreError(error, 'delete', `users/${firebaseUser.uid}/goals/${id}`);
    }
  };

  const addBill = async (b: Omit<Bill, 'id'>) => {
    if (!firebaseUser) return;
    try {
      await addDoc(collection(db, 'users', firebaseUser.uid, 'bills'), b);
      toast.success('Bill added!');
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${firebaseUser.uid}/bills`);
    }
  };

  const toggleBillPaid = async (id: string) => {
    if (!firebaseUser) return;
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    try {
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
      toast.success(newIsPaid ? 'Bill marked as paid' : 'Bill marked as unpaid');
    } catch (error) {
      handleFirestoreError(error, 'update', `users/${firebaseUser.uid}/bills/${id}`);
    }
  };

  const applyBudgetTemplate = async (template: Omit<Budget, 'id'>[]) => {
    if (!firebaseUser) return;
    const userId = firebaseUser.uid;
    try {
      const batch = writeBatch(db);
      
      template.forEach(b => {
        const newDoc = doc(collection(db, 'users', userId, 'budgets'));
        batch.set(newDoc, { ...b, spent: 0, period: 'monthly' });
      });
      
      batch.update(doc(db, 'users', userId, 'profile', 'data'), { onboardingComplete: true });
      await batch.commit();
      toast.success('Budget template applied!');
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${userId}/budgets`);
    }
  };

  const completeOnboarding = async () => {
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid, 'profile', 'data'), { onboardingComplete: true });
    } catch (error) {
      handleFirestoreError(error, 'update', `users/${firebaseUser.uid}/profile/data`);
    }
  };

  const dismissAlert = async (id: string) => {
    if (!firebaseUser) return;
    try {
      await setDoc(doc(db, 'users', firebaseUser.uid, 'alerts', id), { dismissedAt: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${firebaseUser.uid}/alerts/${id}`);
    }
  };

  return (
    <AppContext.Provider value={{
      user, transactions, budgets, goals, bills, notifications, isLoading,
      hasCompletedOnboarding, dismissedAlerts,
      login, signup, logout, addTransaction, deleteTransaction, updateTransaction,
      addBudget, deleteBudget, updateBudget, addGoal, updateGoal, deleteGoal,
      addBill, toggleBillPaid, applyBudgetTemplate, completeOnboarding, dismissAlert,
      updateProfile, markNotificationAsRead
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
