// app/components/SubscriptionAlert.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function SubscriptionAlert({ transactions }: { transactions: any[] }) {
  const [isVisible, setIsVisible] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Logic: Look through the transactions list. 
    // If we find one marked as "isSubscription", show this alert.
    if (transactions) {
        // Find the most recent subscription
        const sub = transactions.find(t => t.isSubscription === true);
        
        if (sub) {
            setSubscription(sub);
            setIsVisible(true);
        } else {
            setSubscription(null); // Hide if no subscriptions found
        }
    }
  }, [transactions]);

  // Don't render anything if user closed it OR if no subscription exists
  if (!isVisible || !subscription) return null;

  // Formatting the amount (removing the negative sign for display)
  const displayAmount = subscription.amount.replace("-", "");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
        animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className="px-6"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-900/80 to-red-900/80 p-4 border border-orange-500/30 shadow-lg shadow-orange-900/20">
          {/* Background decoration */}
          <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-orange-500/20 blur-xl"></div>
          
          <div className="relative z-10 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
              <AlertTriangle size={20} />
            </div>
            
            <div className="flex-1">
              <h4 className="text-sm font-bold text-orange-100">Upcoming Charge</h4>
              <p className="text-xs text-orange-200/80 mt-1">
                <span className="font-semibold text-white">{subscription.name}</span> will charge you <span className="font-semibold text-white">{displayAmount}</span> tomorrow.
              </p>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="text-orange-200/60 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="mt-3 flex gap-2">
              <button className="text-[10px] font-bold bg-white text-orange-900 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors">
                  Cancel Subscription
              </button>
              <button 
                  onClick={() => setIsVisible(false)}
                  className="text-[10px] font-bold text-orange-200 px-3 py-1.5 hover:text-white transition-colors"
              >
                  Ignore
              </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}