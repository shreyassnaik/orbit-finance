// app/components/AiRoast.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, MessageSquareQuote, Bot } from "lucide-react";

const parseAmount = (str: string) => parseFloat(str.replace(/[^0-9.-]+/g,""));

export default function AiRoast({ transactions, name }: { transactions: any[], name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("idle");
  const [insight, setInsight] = useState({ message: "", highlight: "", sub: "" });

  const generateAnalysis = () => {
    if (!transactions || transactions.length === 0) {
        setInsight({
            message: "I'm ready to help you save!",
            highlight: "Let's start tracking.",
            sub: "Add your first expense to get personalized insights."
        });
        return;
    }

    const totals: Record<string, number> = {};
    let totalSpent = 0;

    transactions.forEach(t => {
        if (!t.isIncome) {
            const amt = Math.abs(parseAmount(t.amount));
            totals[t.category] = (totals[t.category] || 0) + amt;
            totalSpent += amt;
        }
    });

    let topCat = "";
    let topAmt = 0;

    Object.entries(totals).forEach(([cat, amt]) => {
        if (amt > topAmt) {
            topAmt = amt;
            topCat = cat;
        }
    });

    const firstName = name?.split(" ")[0] || "Friend";
    let msg = "";
    let hl = "";
    let advice = "";

    // POLITE & HELPFUL MESSAGES
    if (topCat === "Food" || topCat === "Coffee") {
        msg = `Hi ${firstName}, I noticed you've spent`;
        hl = `₹${topAmt} on Dining`;
        advice = "Treating yourself is great! Maybe try a home-cooked meal once this week to save a little? 🥗";
    } else if (topCat === "Shopping") {
        msg = `It looks like you invested`;
        hl = `₹${topAmt} in Shopping`;
        advice = "Everything in moderation! Consider the 24-hour rule before your next big purchase. 🛍️";
    } else if (topCat === "Entertainment") {
        msg = `You've been having fun!`;
        hl = `₹${topAmt} on Entertainment`;
        advice = "Experiences are valuable. Just make sure it aligns with your monthly savings goal. 🎟️";
    } else if (topCat === "Transport") {
        msg = `Your commute added up to`;
        hl = `₹${topAmt}`;
        advice = "If possible, carpooling or public transit could be a wallet-friendly alternative! 🚌";
    } else {
        msg = `You've tracked a total of`;
        hl = `₹${totalSpent}`;
        advice = "Great job tracking your expenses. Awareness is the first step to financial freedom! 🌟";
    }

    setInsight({ message: msg, highlight: hl, sub: advice });
  };

  const handleAnalyze = () => {
    setIsOpen(true);
    setStep("analyzing");
    generateAnalysis();
    
    setTimeout(() => {
      setStep("result");
    }, 2500);
  };

  const close = () => {
    setIsOpen(false);
    setStep("idle");
  };

  return (
    <>
      <motion.button
        onClick={handleAnalyze}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/40 border border-white/20"
      >
        <Sparkles className="h-6 w-6 text-white animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gray-900 shadow-2xl"
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-900 to-purple-900 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bot className="text-indigo-300" size={20} />
                  <span className="font-bold text-white">Orbit Financial Coach</span>
                </div>
                <button onClick={close} className="rounded-full p-1 hover:bg-white/10">
                  <X className="text-white/70" size={20} />
                </button>
              </div>

              <div className="p-6 text-center min-h-[200px] flex flex-col items-center justify-center">
                
                {step === "analyzing" && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="relative h-16 w-16">
                        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500 opacity-20"></div>
                        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500">
                            <Sparkles className="h-8 w-8 text-white animate-spin-slow" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-indigo-300 animate-pulse">
                      Reviewing your financial health...
                    </p>
                  </motion.div>
                )}

                {step === "result" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="text-left w-full"
                  >
                    <div className="mb-4 rounded-xl bg-indigo-500/10 p-3 border border-indigo-500/20">
                         <p className="text-xs text-indigo-300 mb-1 uppercase tracking-wider font-bold">Insight Found</p>
                         <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: "85%" }} 
                                transition={{ duration: 1 }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500" 
                            />
                         </div>
                    </div>

                    <p className="text-lg text-white leading-relaxed font-medium">
                      "{insight.message} <span className="text-indigo-400 font-bold">{insight.highlight}</span>. 📊"
                    </p>
                    
                    <div className="mt-4 flex gap-3 p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/20">
                        <MessageSquareQuote className="text-emerald-400 shrink-0" size={20} />
                        <p className="text-sm text-emerald-200">
                            <strong>Tip:</strong> {insight.sub}
                        </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {step === "result" && (
                  <div className="p-4 bg-gray-900/50 border-t border-white/5">
                    <button 
                        onClick={close}
                        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-purple-500"
                    >
                        Thanks for the tip!
                    </button>
                  </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}