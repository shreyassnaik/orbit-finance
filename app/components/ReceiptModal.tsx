// app/components/ReceiptModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Share2, Download, Barcode } from "lucide-react";

interface ReceiptModalProps {
  transaction: any;
  onClose: () => void;
}

export default function ReceiptModal({ transaction, onClose }: ReceiptModalProps) {
  if (!transaction) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, rotateX: 20 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xs overflow-hidden rounded-t-xl bg-white text-black shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-500 text-xs tracking-widest uppercase">Smart Receipt</h3>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-200">
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Receipt Body */}
          <div className="flex flex-col items-center p-6 pb-10">
            {/* Merchant Icon */}
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${transaction.color} text-white shadow-lg`}>
              <transaction.icon size={32} />
            </div>

            <h2 className="text-xl font-bold text-gray-900">{transaction.name}</h2>
            <p className="text-sm text-gray-500">{transaction.date} • 10:42 AM</p>

            <div className="my-6 text-4xl font-bold tracking-tighter text-gray-900">
              {transaction.amount}
            </div>

            {/* Line Items */}
            <div className="w-full space-y-3 border-t border-dashed border-gray-300 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-mono">{transaction.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>{transaction.amount}</span>
              </div>
            </div>

            {/* Location */}
            <div className="mt-6 flex w-full items-center gap-3 rounded-lg bg-gray-100 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                <MapPin size={16} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">Merchant Location</p>
                <p className="text-[10px] text-gray-500">124 Innovation Blvd, San Francisco, CA</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid w-full grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Share2 size={14} /> Split Bill
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Download size={14} /> Save PDF
              </button>
            </div>

            {/* Fake Barcode */}
            <div className="mt-6 opacity-40">
                <div className="flex h-8 items-center gap-1 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className={`h-full bg-black ${i % 2 === 0 ? "w-1" : "w-2"}`}></div>
                    ))}
                </div>
                <p className="mt-1 text-center font-mono text-[10px]">#0009827371-AUTH</p>
            </div>
          </div>

          {/* Jagged Edge Effect (CSS Trick) */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-900" 
               style={{ 
                   maskImage: "linear-gradient(to bottom, transparent 50%, black 50%)", 
                   maskSize: "20px 20px",
                   clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 5% 70%, 10% 0%, 15% 70%, 20% 0%, 25% 70%, 30% 0%, 35% 70%, 40% 0%, 45% 70%, 50% 0%, 55% 70%, 60% 0%, 65% 70%, 70% 0%, 75% 70%, 80% 0%, 85% 70%, 90% 0%, 95% 70%, 100% 0%)"
               }}>
          </div>
          {/* Use SVG for smoother jagged edge if CSS fails, but let's stick to simple CSS clip-path for speed */}
           <div 
             className="absolute -bottom-1 left-0 right-0 h-3 bg-white"
             style={{
               clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)"
             }}
           ></div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}