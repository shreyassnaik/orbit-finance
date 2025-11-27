// app/components/ManualEntryModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Coffee, ShoppingBag, Car, Zap, Film, Home, MoreHorizontal, CalendarClock } from "lucide-react"; // Added icons

interface ManualEntryModalProps {
  onClose: () => void;
  onConfirm: (data: any) => void;
}

const categories = [
  { id: "Food", icon: Coffee, color: "bg-orange-500" },
  { id: "Shopping", icon: ShoppingBag, color: "bg-blue-500" },
  { id: "Transport", icon: Car, color: "bg-emerald-500" },
  { id: "Bills", icon: Zap, color: "bg-red-500" },
  { id: "Entertainment", icon: Film, color: "bg-purple-500" },
  { id: "Rent", icon: Home, color: "bg-indigo-500" },
  { id: "Other", icon: MoreHorizontal, color: "bg-gray-500" }, // <--- ADDED "Other"
];

export default function ManualEntryModal({ onClose, onConfirm }: ManualEntryModalProps) {
  const [amount, setAmount] = useState("");
  const [store, setStore] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isSubscription, setIsSubscription] = useState(false); // <--- ADDED STATE

  const handleSubmit = () => {
    if (!amount || !store) return;

    // For demo purposes, if it's a subscription, we set the next billing date to tomorrow.
    // In a real app, you'd ask for the date.
    const nextBillingDate = new Date();
    nextBillingDate.setDate(nextBillingDate.getDate() + 1);

    const newTransaction = {
      name: store,
      category: selectedCategory.id,
      amount: `-₹${amount}`,
      date: new Date().toISOString(),
      color: selectedCategory.color,
      isIncome: false,
      isSubscription: isSubscription, // <--- INCLUDE IN DATA
      nextBillingDate: isSubscription ? nextBillingDate.toISOString() : null, // <--- INCLUDE DATE
    };

    onConfirm(newTransaction);
    // Reset form
    setAmount("");
    setStore("");
    setIsSubscription(false);
    setSelectedCategory(categories[0]);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-t-3xl bg-[#111827] p-6 shadow-2xl sm:rounded-3xl border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add Expense</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400">
              <X size={24} />
            </button>
          </div>

          {/* Amount Input (Big) */}
          <div className="mb-6 relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-500">₹</span>
            <input
              suppressHydrationWarning
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              autoFocus
              className="w-full bg-transparent border-b border-gray-700 py-2 pl-8 text-4xl font-bold text-white placeholder-gray-700 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Store Name */}
          <div className="mb-6">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Paid To</label>
            <input
              suppressHydrationWarning
              type="text"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              placeholder="e.g. Starbucks, Uber, Reliance"
              className="mt-2 w-full rounded-xl bg-gray-800 p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Selector */}
          <div className="mb-6">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Category</label>
            <div className="mt-3 grid grid-cols-4 gap-3"> {/* Changed to grid-cols-4 to fit "Other" */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 transition-all ${
                    selectedCategory.id === cat.id
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <cat.icon size={20} />
                  <span className="text-[10px] font-medium">{cat.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Checkbox - NEW */}
          <div className="mb-8 flex items-center gap-3 rounded-xl bg-gray-800/50 p-4 border border-gray-700/50">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isSubscription ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-700 text-gray-400'}`}>
                <CalendarClock size={20} />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Recurring Subscription</h4>
                <p className="text-xs text-gray-400">Is this a monthly payment?</p>
            </div>
            <button
                onClick={() => setIsSubscription(!isSubscription)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSubscription ? 'bg-indigo-600' : 'bg-gray-700'}`}
            >
                <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSubscription ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!amount || !store}
            className="w-full rounded-xl bg-white py-4 font-bold text-black hover:bg-gray-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} /> Save Transaction
          </button>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}