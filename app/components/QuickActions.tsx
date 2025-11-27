// app/components/QuickActions.tsx
"use client";

import { FileText, PlusCircle, CreditCard, MoreHorizontal } from "lucide-react"; // Changed Send to FileText

const actions = [
  { id: "report", icon: FileText, label: "Statement" }, // <--- CHANGED THIS LINE
  { id: "topup", icon: PlusCircle, label: "Top Up" },
  { id: "pay", icon: CreditCard, label: "Pay" },
  { id: "more", icon: MoreHorizontal, label: "More" },
];

export default function QuickActions({ onAction }: { onAction: (type: any) => void }) {
  return (
    <div className="flex justify-between px-6 py-6">
      {actions.map((item) => (
        <button
          key={item.id}
          onClick={() => onAction(item.id)}
          className="group flex flex-col items-center gap-2"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-lg transition-all duration-300 group-hover:bg-indigo-600 group-hover:border-indigo-400 group-hover:shadow-indigo-500/50 group-active:scale-95">
            <item.icon className="h-6 w-6 text-slate-700 dark:text-white group-hover:text-white transition-colors" />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}