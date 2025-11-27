// app/components/DepositModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, TrendingUp } from "lucide-react";
import { useState } from "react";

interface DepositModalProps {
  goal: any;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function DepositModal({ goal, onClose, onConfirm }: DepositModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (!amount) return;
    onConfirm(parseFloat(amount));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-sm rounded-3xl bg-[#111827] p-8 shadow-2xl border border-white/10"
        >
          <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="text-xl font-bold text-white">Save for {goal.name}</h2>
                <p className="text-xs text-gray-400">Current: ₹{goal.saved} / ₹{goal.target}</p>
             </div>
             <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400">
                <X size={20} />
             </button>
          </div>

          <div className="mb-8">
             <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-500">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full bg-transparent border-b-2 border-gray-700 py-4 pl-10 text-4xl font-bold text-white placeholder-gray-700 outline-none focus:border-indigo-500 transition-colors"
                />
             </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!amount}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
             Add to Savings <ArrowRight size={18} />
          </button>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}