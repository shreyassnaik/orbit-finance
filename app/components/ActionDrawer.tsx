// app/components/ActionDrawer.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, QrCode, Edit2, Snowflake, Settings, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type DrawerType = "send" | "request" | "pay" | "more" | "profile" | "add-goal" | null;

interface ActionDrawerProps {
  isOpen: boolean;
  type: DrawerType;
  onClose: () => void;
  onLogout?: () => void;
  onAddGoal?: (goal: any) => void;
  user?: any;
  userData?: any;
  isFrozen?: boolean;
  onToggleFreeze?: () => void;
  // NEW PROPS
  currentSpent?: number;
  monthlyLimit?: number;
  onUpdateLimit?: (newLimit: number) => void;
}

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

export default function ActionDrawer({ 
  isOpen, type, onClose, onLogout, onAddGoal, user, userData, 
  isFrozen, onToggleFreeze, currentSpent = 0, monthlyLimit = 20000, onUpdateLimit 
}: ActionDrawerProps) {
  
  const [step, setStep] = useState("input");
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  
  // LIMIT EDITING STATE
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [limitInput, setLimitInput] = useState("");

  useEffect(() => {
    if (isOpen) {
        setStep("input");
        setGoalName("");
        setGoalTarget("");
        setIsEditingAvatar(false);
        setIsEditingLimit(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (type === "add-goal" && onAddGoal) {
        onAddGoal({
            name: goalName,
            target: parseFloat(goalTarget),
            saved: 0
        });
        setStep("success");
        setTimeout(onClose, 1000);
        return;
    }
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(onClose, 1500);
    }, 1500);
  };

  const handleAvatarSelect = async (avatarId: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), { avatarId: avatarId });
    setIsEditingAvatar(false);
  };

  const saveLimit = () => {
      if (onUpdateLimit && limitInput) {
          onUpdateLimit(parseFloat(limitInput));
          setIsEditingLimit(false);
      }
  };

  const getTitle = () => {
    switch (type) {
      case "send": return "Send Money";
      case "pay": return "Scan & Pay";
      case "profile": return "My Profile";
      case "add-goal": return "New Savings Goal";
      case "more": return "Card Controls";
      default: return "Options";
    }
  };

  const currentAvatarId = userData?.avatarId || "default";
  const currentAvatar = avatars.find(a => a.id === currentAvatarId) || avatars[0];

  // Calculate Progress for Limit
  const progressPercent = Math.min((currentSpent / monthlyLimit) * 100, 100);
  const isOverLimit = currentSpent > monthlyLimit;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-[2rem] border-t border-white/10 bg-[#111827] p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{getTitle()}</h3>
              <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                <X size={20} />
              </button>
            </div>

            <div className="min-h-[200px]">
              
              {step === "processing" && (
                <div className="flex h-40 flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="text-sm text-gray-400">Processing...</p>
                </div>
              )}

              {step === "success" && (
                <div className="flex h-40 flex-col items-center justify-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                        <Check size={32} />
                    </div>
                    <p className="text-lg font-bold text-white">Success!</p>
                </div>
              )}

              {step === "input" && (
                <>  
                    {/* MORE MENU (UPDATED) */}
                    {type === "more" && (
                        <div className="space-y-4">
                            {/* Freeze Toggle */}
                            <div className="flex items-center justify-between rounded-xl bg-gray-800 p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isFrozen ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                                        <Snowflake size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Freeze Card</p>
                                        <p className="text-xs text-gray-400">Temporarily disable payments</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onToggleFreeze}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFrozen ? 'bg-blue-600' : 'bg-gray-600'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFrozen ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {/* Monthly Limit (EDITABLE & REAL) */}
                            <div className="rounded-xl bg-gray-800 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${isOverLimit ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            <Settings size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Monthly Limit</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (isEditingLimit) saveLimit();
                                            else {
                                                setLimitInput(monthlyLimit.toString());
                                                setIsEditingLimit(true);
                                            }
                                        }}
                                        className="text-indigo-400 hover:text-white p-2"
                                    >
                                        {isEditingLimit ? <Save size={18} /> : <Edit2 size={16} />}
                                    </button>
                                </div>

                                {isEditingLimit ? (
                                    <div className="mb-4">
                                        <label className="text-xs text-gray-400">Set new limit</label>
                                        <input 
                                            type="number" 
                                            value={limitInput}
                                            onChange={(e) => setLimitInput(e.target.value)}
                                            className="w-full bg-gray-900 text-white rounded-lg p-2 mt-1 border border-gray-700 focus:border-indigo-500 outline-none"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercent}%` }}
                                                className={`h-full ${isOverLimit ? 'bg-red-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`} 
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                                            <span className={isOverLimit ? "text-red-400 font-bold" : ""}>Spent: ₹{currentSpent}</span>
                                            <span>Limit: ₹{monthlyLimit}</span>
                                        </div>
                                        {isOverLimit && (
                                            <p className="text-xs text-red-400 mt-2 font-medium">⚠️ Limit exceeded! Watch your spending.</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* NEW GOAL FORM */}
                    {type === "add-goal" && (
                        <div className="space-y-4">
                             <div>
                                <label className="text-xs text-gray-400">Goal Name</label>
                                <input type="text" placeholder="e.g. New Car" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="w-full rounded-xl bg-gray-800 p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Target Amount (₹)</label>
                                <input type="number" placeholder="50000" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} className="w-full rounded-xl bg-gray-800 p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <button onClick={handleSubmit} className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-4 font-bold text-white">Create Vault</button>
                        </div>
                    )}

                    {/* PROFILE */}
                    {type === "profile" && (
                        <div className="flex flex-col items-center gap-6">
                             <div className="relative">
                                <motion.div layoutId="avatar" className={`h-24 w-24 rounded-full ${currentAvatar.bg} ring-4 ring-white/10 flex items-center justify-center text-4xl shadow-xl`}>
                                    {currentAvatar.emoji || (userData?.name ? userData.name[0].toUpperCase() : "U")}
                                </motion.div>
                                <button onClick={() => setIsEditingAvatar(!isEditingAvatar)} className="absolute bottom-0 right-0 p-2 rounded-full bg-white text-black shadow-lg hover:bg-gray-200 transition-colors">
                                    {isEditingAvatar ? <X size={14} /> : <Edit2 size={14} />}
                                </button>
                             </div>
                             <AnimatePresence>
                                {isEditingAvatar && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full overflow-hidden">
                                        <p className="text-center text-xs text-gray-400 mb-3">Choose your persona</p>
                                        <div className="grid grid-cols-5 gap-3 p-2">
                                            {avatars.map((av) => (
                                                <button key={av.id} onClick={() => handleAvatarSelect(av.id)} className={`aspect-square rounded-full ${av.bg} flex items-center justify-center text-xl hover:scale-110 transition-transform ${currentAvatarId === av.id ? 'ring-2 ring-white' : ''}`}>
                                                    {av.emoji || (userData?.name ? userData.name[0].toUpperCase() : "U")}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                             {!isEditingAvatar && (
                                 <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">{userData?.name || "User"}</h3>
                                    <p className="text-gray-400">{user?.email}</p>
                                 </div>
                             )}
                             <button onClick={onLogout} className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3 font-semibold text-red-400 hover:bg-red-500/20">Sign Out</button>
                        </div>
                    )}

                    {/* PAY */}
                    {type === "pay" && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-indigo-500 bg-gray-800/50">
                                <div className="absolute inset-0 animate-pulse bg-indigo-500/10"></div>
                                <QrCode size={48} className="text-white" />
                            </div>
                            <button onClick={handleSubmit} className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white hover:bg-indigo-500">Scan</button>
                        </div>
                    )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}