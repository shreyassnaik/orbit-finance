// app/components/BackgroundAnimation.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundAnimation() {
  const [rupees, setRupees] = useState<any[]>([]);

  // Generate random particles ONLY on the client side after mount
  useEffect(() => {
    const rupeeCount = 20;
    const newRupees = [...Array(rupeeCount)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 20 + 10}px`,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }));
    setRupees(newRupees);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none font-sans">
      
      {/* ================= EXISTING AURORA ANIMATION ================= */}
      {/* Background Base Color */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-[#030712] transition-colors duration-300"></div>

      {/* Orb 1: Purple/Indigo */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 h-[50vh] w-[50vh] rounded-full bg-purple-500/40 dark:bg-indigo-500/30 blur-[80px]"
      />

      {/* Orb 2: Cyan/Blue */}
      <motion.div
        animate={{ scale: [1, 1.5, 1], x: [0, -50, 0], y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 -right-20 h-[60vh] w-[60vh] rounded-full bg-cyan-400/30 dark:bg-blue-600/30 blur-[100px]"
      />

      {/* Orb 3: Pink/Orange */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-10 h-[40vh] w-[40vh] rounded-full bg-pink-400/30 dark:bg-purple-600/30 blur-[90px]"
      />


      {/* ================= NEW: NEON RUPEE FLOW ANIMATION ================= */}
      <div className="absolute inset-0 z-10">
        {rupees.map((r) => (
          <motion.div
            key={r.id}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ 
                y: "-10vh", 
                opacity: [0, 1, 1, 0], 
                rotate: [0, Math.random() * 360] 
            }}
            transition={{
              duration: r.duration,
              repeat: Infinity,
              delay: r.delay,
              ease: "linear",
            }}
            style={{ left: r.left, fontSize: r.fontSize }}
            className="absolute font-bold text-green-500 dark:text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)] dark:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]"
          >
            ₹
          </motion.div>
        ))}
      </div>

    </div>
  );
}