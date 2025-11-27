// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "./lib/firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, collection, query, orderBy, addDoc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { Sun, Moon } from "lucide-react";

// --- COMPONENT IMPORTS ---
import BalanceCard from "./components/BalanceCard";
import QuickActions from "./components/QuickActions";
import SpendingChart from "./components/SpendingChart";
import Transactions from "./components/Transactions";
import AiRoast from "./components/AiRoast";
import SavingsGoals from "./components/SavingsGoals";
import SubscriptionAlert from "./components/SubscriptionAlert";
import LoginScreen from "./components/LoginScreen";
import ActionDrawer from "./components/ActionDrawer";
import ReceiptModal from "./components/ReceiptModal";
import Achievements from "./components/Achievements";
import AddMoneyModal from "./components/AddMoneyModal";
import ManualEntryModal from "./components/ManualEntryModal";
import BackgroundAnimation from "./components/BackgroundAnimation";
import ReportModal from "./components/ReportModal";
import DepositModal from "./components/DepositModal";

// Avatar Definitions
const avatars = [
  { id: "default", emoji: "", bg: "bg-gradient-to-tr from-indigo-500 to-purple-500" },
  { id: "gamer", emoji: "😎", bg: "bg-gradient-to-tr from-yellow-400 to-orange-500" },
  { id: "tech", emoji: "👨‍💻", bg: "bg-gradient-to-tr from-blue-500 to-cyan-400" },
  { id: "girl", emoji: "👩‍🚀", bg: "bg-gradient-to-tr from-pink-500 to-rose-500" },
  { id: "ninja", emoji: "🥷", bg: "bg-gradient-to-tr from-slate-700 to-slate-900" },
  { id: "king", emoji: "👑", bg: "bg-gradient-to-tr from-amber-300 to-yellow-600" },
  { id: "robot", emoji: "🤖", bg: "bg-gradient-to-tr from-emerald-400 to-teal-600" },
  { id: "cat", emoji: "😼", bg: "bg-gradient-to-tr from-purple-400 to-indigo-600" },
  { id: "alien", emoji: "👽", bg: "bg-gradient-to-tr from-green-400 to-emerald-700" },
  { id: "fire", emoji: "🔥", bg: "bg-gradient-to-tr from-red-500 to-orange-600" },
];

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState<any>(null); 
  const [userData, setUserData] = useState<any>(null); 
  
  // Data Lists
  const [transactions, setTransactions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  
  // UI State
  const [activeDrawer, setActiveDrawer] = useState<any>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- FIREBASE LISTENERS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        
        // 1. User Profile
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubUser = onSnapshot(userDocRef, (doc) => {
           const data = doc.data();
           setUserData(data);
           if (data && data.balance === 0) setShowAddMoney(true);
        });

        // 2. Transactions
        const txQuery = query(collection(db, "users", currentUser.uid, "transactions"), orderBy("date", "desc"));
        const unsubTx = onSnapshot(txQuery, (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 3. Goals
        const goalsQuery = query(collection(db, "users", currentUser.uid, "goals"));
        const unsubGoals = onSnapshot(goalsQuery, (snapshot) => {
            setGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => { unsubUser(); unsubTx(); unsubGoals(); };
      }
    });
    return () => unsubscribe();
  }, []);

  // --- HELPER: CALCULATE TOTAL SPENT ---
  const currentSpent = transactions
    .filter(t => !t.isIncome)
    .reduce((acc, t) => acc + Math.abs(parseFloat(t.amount.replace(/[^0-9.-]+/g, ""))), 0);

  // --- ACTIONS ---

  const handleLogout = async () => {
    await signOut(auth);
    setActiveDrawer(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // UPDATE MONTHLY LIMIT
  const handleUpdateLimit = async (newLimit: number) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), { monthlyLimit: newLimit });
  };

  const handleAddTransaction = async (newTx: any) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "transactions"), { ...newTx });
    const amountNum = parseFloat(newTx.amount.replace(/[^0-9.-]+/g,""));
    await updateDoc(doc(db, "users", user.uid), { balance: increment(amountNum) });
    setShowManualEntry(false);

    // CHECK LIMIT ALERT (Logic: If New Total > Limit)
    const limit = userData?.monthlyLimit || 20000;
    if (currentSpent + amountNum > limit) {
        // Simple Alert for demo - polite warning
        setTimeout(() => {
            alert(`⚠️ Heads up! You've exceeded your monthly limit of ₹${limit}.`);
        }, 500);
    }
  };

  const handleAddMoney = async (amount: number) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), { balance: increment(amount) });
    await addDoc(collection(db, "users", user.uid, "transactions"), {
        name: "Wallet Top Up",
        category: "Income",
        amount: `+₹${amount}`,
        date: new Date().toISOString(),
        color: "bg-emerald-500",
        isIncome: true
    });
    setShowAddMoney(false);
  };

  const handleAddGoal = async (goalData: any) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "goals"), goalData);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "goals", goalId));
  };

  const handleDepositToGoal = async (amount: number) => {
    if (!user || !selectedGoal) return;

    const goalRef = doc(db, "users", user.uid, "goals", selectedGoal.id);
    await updateDoc(goalRef, { saved: increment(amount) });
    await updateDoc(doc(db, "users", user.uid), { balance: increment(-amount) });

    await addDoc(collection(db, "users", user.uid, "transactions"), {
        name: `Savings: ${selectedGoal.name}`,
        category: "Savings",
        amount: `-₹${amount}`,
        date: new Date().toISOString(),
        color: "bg-blue-500",
        isIncome: false
    });

    setSelectedGoal(null);
  };

  const handleAction = (type: string) => {
    if (type === "pay" && isCardFrozen) {
      alert("❌ Transaction Failed: Your card is frozen. Unfreeze it in the 'More' menu to continue.");
      return; 
    }

    if (type === "pay") setShowManualEntry(true);
    else if (type === "topup") setShowAddMoney(true);
    else if (type === "report") setShowReport(true);
    else setActiveDrawer(type);
  };

  const currentAvatar = avatars.find(a => a.id === userData?.avatarId) || avatars[0];

  // --- RENDER ---
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className="min-h-screen w-full max-w-md mx-auto text-foreground relative overflow-hidden shadow-2xl transition-colors duration-300">
        
        <BackgroundAnimation />

        <AnimatePresence mode="wait">
          
          {!user ? (
            <motion.div key="login" className="h-full w-full relative z-10">
              <LoginScreen onLogin={() => {}} />
            </motion.div>
          ) : (
            
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 h-screen w-full overflow-y-auto pb-32 no-scrollbar"
            >
              {/* Header */}
              <header className="px-6 mb-6 pt-8 flex items-center justify-between">
                <div>
                  <h2 className="text-gray-500 dark:text-gray-400 text-sm">Welcome back,</h2>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    {userData?.name || "User"}
                  </h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-white/50 dark:bg-white/10 text-gray-700 dark:text-yellow-400 transition-colors backdrop-blur-md shadow-sm"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <motion.button 
                        onClick={() => setActiveDrawer("profile")}
                        className={`h-10 w-10 rounded-full ${currentAvatar.bg} ring-2 ring-white/20 shadow-lg flex items-center justify-center text-lg`}
                    >
                        {currentAvatar.emoji || (userData?.name ? userData.name[0].toUpperCase() : "U")}
                    </motion.button>
                </div>
              </header>

              {/* Components */}
              <SubscriptionAlert transactions={transactions} />
              
              <BalanceCard 
                balance={userData?.balance || 0} 
                name={userData?.name || ""} 
                isFrozen={isCardFrozen} 
              />
              
              <QuickActions onAction={handleAction} />
              
              <SpendingChart transactions={transactions} />
              
              <SavingsGoals 
                goals={goals} 
                onAdd={() => setActiveDrawer("add-goal")} 
                onDeposit={setSelectedGoal} 
                onDelete={handleDeleteGoal}
              />
              
              <Achievements transactions={transactions} goals={goals} />
              
              <div className="mt-6 mb-10">
                <Transactions transactions={transactions} onSelect={setSelectedTransaction} />
              </div>

              <AiRoast transactions={transactions} name={userData?.name || "User"} /> 

              {/* --- OVERLAYS --- */}

              <ActionDrawer 
                isOpen={!!activeDrawer} 
                type={activeDrawer} 
                onClose={() => setActiveDrawer(null)}
                onLogout={handleLogout}
                onAddGoal={handleAddGoal}
                user={user}
                userData={userData}
                
                // CARD CONTROLS & LIMIT
                isFrozen={isCardFrozen}
                onToggleFreeze={() => setIsCardFrozen(!isCardFrozen)}
                currentSpent={currentSpent}
                monthlyLimit={userData?.monthlyLimit || 20000} // Default 20k
                onUpdateLimit={handleUpdateLimit}
              />

              <ReceiptModal 
                transaction={selectedTransaction} 
                onClose={() => setSelectedTransaction(null)} 
              />
              
              {showManualEntry && (
                  <ManualEntryModal 
                      onClose={() => setShowManualEntry(false)} 
                      onConfirm={handleAddTransaction} 
                  />
              )}

              {showAddMoney && (
                  <AddMoneyModal 
                      onClose={() => setShowAddMoney(false)} 
                      onAdd={handleAddMoney} 
                  />
              )}

              {showReport && (
                  <ReportModal 
                    onClose={() => setShowReport(false)} 
                    transactions={transactions} 
                    userData={userData}
                  />
              )}

              {selectedGoal && (
                  <DepositModal 
                    goal={selectedGoal} 
                    onClose={() => setSelectedGoal(null)} 
                    onConfirm={handleDepositToGoal} 
                  />
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}