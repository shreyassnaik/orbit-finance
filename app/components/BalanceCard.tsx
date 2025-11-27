// app/components/BalanceCard.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Palette, Check, Lock, Snowflake } from "lucide-react";
import { useState, useEffect } from "react";

const themes = [
  { id: "orbit", name: "Orbit (Default)", css: "from-indigo-600 via-purple-700 to-pink-600" },
  { id: "ocean", name: "Deep Ocean", css: "from-blue-700 via-blue-500 to-cyan-400" },
  { id: "sunset", name: "Sunset", css: "from-orange-500 via-red-500 to-pink-500" },
  { id: "forest", name: "Cyber Forest", css: "from-emerald-600 via-teal-600 to-cyan-600" },
  { id: "midnight", name: "Midnight", css: "from-slate-900 via-gray-800 to-black" },
  { id: "gold", name: "Luxury Gold", css: "from-yellow-600 via-yellow-500 to-amber-400" },
];

// Added isFrozen prop
export default function BalanceCard({ balance, name, isFrozen }: { balance: number, name: string, isFrozen: boolean }) {
  const [currentTheme, setCurrentTheme] = useState(themes[0].css);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("card-theme");
    if (saved) setCurrentTheme(saved);
  }, []);

  const handleThemeChange = (css: string) => {
    setCurrentTheme(css);
    localStorage.setItem("card-theme", css);
  };

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(balance);

  return (
    <div className="relative mx-6 perspective-1000">
      <motion.div
        whileHover={{ scale: 1.02, rotateX: 2 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentTheme} p-6 shadow-2xl shadow-indigo-500/30 transition-all duration-500`}
      >
        {/* Background decoration */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black opacity-10 blur-2xl"></div>

        {/* --- FROZEN OVERLAY (NEW) --- */}
        <AnimatePresence>
            {isFrozen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-40 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                >
                    <div className="p-4 rounded-full bg-white/10 mb-2">
                        <Lock size={32} />
                    </div>
                    <span className="font-bold tracking-widest uppercase text-sm">Card Frozen</span>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Customization Button */}
        <button 
            onClick={() => setShowPicker(!showPicker)}
            className="absolute top-4 right-4 z-20 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
            <Palette size={16} />
        </button>

        {/* Color Picker */}
        <AnimatePresence>
            {showPicker && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-14 right-4 z-30 flex flex-col gap-2 rounded-xl bg-black/60 p-2 backdrop-blur-md border border-white/10 shadow-xl"
                >
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => handleThemeChange(t.css)}
                            className={`group flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${t.css} border-2 ${currentTheme === t.css ? 'border-white' : 'border-transparent hover:border-white/50'}`}
                            title={t.name}
                        >
                            {currentTheme === t.css && <Check size={12} className="text-white drop-shadow-md" />}
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Card Content */}
        <div className="relative z-10 flex flex-col justify-between h-48">
          
          <div className="flex justify-between items-start">
              <div className="h-10 w-12 rounded-lg bg-yellow-400/70 border border-yellow-400/80 flex items-center justify-center backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-1 opacity-80">
                      <div className="h-4 w-px bg-white"></div>
                      <div className="h-4 w-px bg-white"></div>
                  </div>
              </div>
              <Wifi className="text-white/60 rotate-90 mr-12" />
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-white/80">Total Balance</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold text-white drop-shadow-md">{formattedBalance}</h2>
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
              <p className="text-white/60 font-mono tracking-widest text-sm uppercase shadow-black">{name || "USER"}</p>
              
              <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }} 
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="origin-center"
                  >
                    <svg width="48" height="32" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg opacity-90">
                        <ellipse cx="50" cy="30" rx="40" ry="12" stroke="white" strokeWidth="6" transform="rotate(-15 50 30)" strokeOpacity="0.6" />
                        <circle cx="50" cy="30" r="14" fill="white" fillOpacity="0.9" />
                    </svg>
                  </motion.div>
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}