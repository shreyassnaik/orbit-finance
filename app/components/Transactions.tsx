"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowDownLeft, 
  Coffee, 
  ShoppingBag, 
  Car, 
  Zap, 
  Film, 
  Home, 
  MoreHorizontal, 
  Ghost 
} from "lucide-react";

// Helper to format dates nicely (Today, Yesterday, Nov 27)
const formatDate = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// Helper to pick the EXACT icon from ManualEntryModal
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Food": return Coffee;
    case "Shopping": return ShoppingBag;
    case "Transport": return Car;
    case "Bills": return Zap;
    case "Entertainment": return Film;
    case "Rent": return Home;
    case "Income": return ArrowDownLeft;
    default: return MoreHorizontal;
  }
};

export default function Transactions({ 
  transactions, 
  onSelect 
}: { 
  transactions: any[], 
  onSelect: (t: any) => void 
}) {
  
  // 1. HANDLE EMPTY STATE
  if (!transactions || transactions.length === 0) {
    return (
      <div className="px-6 pb-6 text-center opacity-50 mt-10">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 transition-colors">
           <Ghost size={32} className="text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No transactions yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-600">Top up your wallet to start!</p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Recent Activity</h3>
        <button className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">See All</button>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
            {transactions.map((t, i) => {
                const IconComponent = getCategoryIcon(t.category);

                return (
                <motion.div
                    key={t.id || i}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => onSelect(t)}
                    // Light/Dark Mode Classes
                    className="group flex cursor-pointer items-center justify-between rounded-2xl bg-white/60 dark:bg-slate-900/50 p-3 border border-gray-200 dark:border-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors active:scale-95 shadow-sm dark:shadow-none"
                >
                    <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${t.color || "bg-gray-500"} bg-opacity-10`}>
                        {/* Adapt Icon Color */}
                        <IconComponent className={`h-6 w-6 ${t.color === "bg-gray-200" ? "text-gray-600 dark:text-gray-300" : "text-gray-900 dark:text-white"}`} />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">{t.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{t.category}</p>
                    </div>
                    </div>
                    <div className="text-right">
                    <p className={`font-bold ${t.isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                        {t.amount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-500">
                        {formatDate(t.date)}
                    </p>
                    </div>
                </motion.div>
                );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}