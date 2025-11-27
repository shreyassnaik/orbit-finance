// app/components/SavingsGoals.tsx
"use client";

import { motion } from "framer-motion";
import { Car, Plane, Laptop, Plus, Target, Trash2 } from "lucide-react";

const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if(n.includes("car") || n.includes("bike")) return Car;
    if(n.includes("trip") || n.includes("vacation")) return Plane;
    if(n.includes("mac") || n.includes("tech") || n.includes("phone")) return Laptop;
    return Target;
}

// Added onDelete prop
export default function SavingsGoals({ 
  goals, 
  onAdd, 
  onDeposit, 
  onDelete 
}: { 
  goals: any[], 
  onAdd: () => void, 
  onDeposit: (goal: any) => void,
  onDelete: (id: string) => void 
}) {
  return (
    <div className="mt-6 pl-6">
      <div className="flex items-center justify-between pr-6 mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Savings Targets</h3>
        <button 
            onClick={onAdd}
            className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
        >
          <Plus size={14} /> New Goal
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pr-6 no-scrollbar">
        {goals.length === 0 && (
            <p className="text-sm text-gray-500 italic">No goals yet. Create one!</p>
        )}

        {goals.map((goal, i) => {
          const Icon = getIcon(goal.name);
          const progress = Math.min(Math.round((goal.saved / goal.target) * 100), 100);

          return (
          <motion.div
            key={goal.id}
            onClick={() => onDeposit(goal)} 
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative min-w-[160px] flex-shrink-0 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm dark:shadow-none backdrop-blur-md cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-20`}>
                    <Icon size={18} className="text-white" />
                </div>
                
                {/* DELETE BUTTON */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents opening the deposit modal
                        onDelete(goal.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>
            
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{goal.name}</h4>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-lg font-bold text-gray-900 dark:text-white">₹{goal.saved}</span>
              <span className="text-xs text-gray-500 mb-1">/ {goal.target}</span>
            </div>

            <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className={`h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400`}
              />
            </div>
            <p className="mt-2 text-right text-[10px] text-gray-400 group-hover:text-indigo-400 transition-colors">{progress}%</p>
          </motion.div>
        )})}

        <motion.div
           onClick={onAdd}
           className="flex min-w-[100px] flex-shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 bg-transparent p-4 hover:bg-gray-100 dark:hover:bg-slate-900/50 cursor-pointer group transition-colors"
        >
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:bg-indigo-600 transition-colors">
                <Plus size={16} className="text-gray-500 dark:text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-500 group-hover:text-gray-900 dark:group-hover:text-white">Add Goal</span>
        </motion.div>
      </div>
    </div>
  );
}