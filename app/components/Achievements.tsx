// app/components/Achievements.tsx
"use client";

import { motion } from "framer-motion";
import { Award, Shield, Zap, Wallet, Lock } from "lucide-react";

export default function Achievements({ transactions, goals }: { transactions: any[], goals: any[] }) {
  
  const hasGoals = goals.length > 0;
  const hasIncome = transactions.some(t => t.isIncome);
  const transactionCount = transactions.length;
  const savedAmount = goals.reduce((acc, curr) => acc + curr.saved, 0);

  const badges = [
    { id: 1, name: "Saver Sage", desc: "Created a Goal", icon: Shield, color: "from-emerald-400 to-green-600", unlocked: hasGoals },
    { id: 2, name: "Active User", desc: "5+ Transactions", icon: Zap, color: "from-yellow-400 to-orange-600", unlocked: transactionCount >= 5 },
    { id: 3, name: "Money Maker", desc: "Added Funds", icon: Wallet, color: "from-blue-400 to-indigo-600", unlocked: hasIncome },
    { id: 4, name: "Visionary", desc: "Saved ₹5k+", icon: Award, color: "from-purple-400 to-pink-600", unlocked: savedAmount >= 5000 },
  ];

  return (
    <div className="mt-6 pl-6">
      {/* FIX: Adaptive Header Text */}
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white transition-colors">Financial Mastery</h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 pr-6 no-scrollbar">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            // FIX: Adaptive Card Styles
            className={`relative flex min-w-[100px] flex-col items-center justify-center rounded-2xl border p-3 py-4 text-center backdrop-blur-md transition-colors ${
              badge.unlocked 
                ? "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/60" 
                : "border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/30 opacity-60 grayscale"
            }`}
          >
            <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br shadow-lg ${
                badge.unlocked ? badge.color : "from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800"
            }`}>
              {badge.unlocked ? (
                  <badge.icon size={20} className="text-white" />
              ) : (
                  <Lock size={18} className="text-white" />
              )}
            </div>

            {/* FIX: Text Colors */}
            <h4 className={`text-xs font-bold ${badge.unlocked ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
                {badge.name}
            </h4>
            <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">{badge.desc}</p>
            
            {badge.unlocked && (
                <div className={`absolute -inset-0.5 z-[-1] rounded-2xl bg-gradient-to-br ${badge.color} opacity-10 blur-md`}></div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}