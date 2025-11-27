// app/components/ReportModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, CheckCircle, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportModalProps {
  onClose: () => void;
  transactions: any[];
  userData: any;
}

export default function ReportModal({ onClose, transactions, userData }: ReportModalProps) {
  const [status, setStatus] = useState("idle"); // idle, generating, success
  const [format, setFormat] = useState<"pdf" | "excel">("pdf"); // <--- NEW STATE

  const generatePDF = () => {
    setStatus("generating");

    setTimeout(() => {
      const doc = new jsPDF();

      // HEADER
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229);
      doc.text("ORBIT FINANCE", 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Statement of Accounts", 14, 28);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 33);

      // USER DETAILS
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Account Holder: ${userData?.name || "Valued User"}`, 14, 45);
      doc.text(`Email: ${userData?.email || "N/A"}`, 14, 51);
      doc.text(`Current Balance: Rs. ${userData?.balance || 0}`, 14, 57);

      // TABLE
      const tableData = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.name,
        t.category,
        t.amount.replace("₹", "Rs. "), 
      ]);

      autoTable(doc, {
        startY: 80,
        head: [["Date", "Description", "Category", "Amount"]],
        body: tableData,
        headStyles: { fillColor: [79, 70, 229] },
        alternateRowStyles: { fillColor: [245, 245, 255] },
        styles: { fontSize: 9 },
      });

      // FOOTER
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("This is a computer-generated statement.", 14, finalY + 10);
      doc.text("Orbit Finance Inc.", 14, finalY + 15);

      doc.save(`Orbit_Statement_${new Date().toISOString().split("T")[0]}.pdf`);
      
      setStatus("success");
      setTimeout(() => onClose(), 2000);
    }, 1500);
  };

  // --- NEW: EXCEL (CSV) LOGIC ---
  const generateExcel = () => {
    setStatus("generating");

    setTimeout(() => {
        // 1. Create Headers
        const headers = ["Date,Description,Category,Amount,Type"];
        
        // 2. Create Rows
        const rows = transactions.map(t => {
            const date = new Date(t.date).toLocaleDateString();
            const desc = `"${t.name}"`; // Escape quotes
            const cat = t.category;
            const amt = t.amount.replace("₹", ""); // Remove symbol for math
            const type = t.isIncome ? "Income" : "Expense";
            return `${date},${desc},${cat},${amt},${type}`;
        });

        // 3. Combine
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        
        // 4. Download Trigger
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Orbit_Statement_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setStatus("success");
        setTimeout(() => onClose(), 2000);
    }, 1500);
  };

  const handleDownload = () => {
      if (format === "pdf") generatePDF();
      else generateExcel();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#111827] p-6 shadow-2xl border border-gray-200 dark:border-white/10"
        >
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">Export Statement</h2>
             <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400">
                <X size={20} />
             </button>
          </div>

          <div className="flex flex-col items-center gap-6 py-4">
            
            {status === "idle" && (
                <>
                    {/* SELECTION GRID */}
                    <div className="flex gap-4 w-full">
                        <button 
                            onClick={() => setFormat("pdf")}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                format === "pdf" 
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-indigo-300"
                            }`}
                        >
                            <FileText size={32} />
                            <span className="font-bold text-sm">PDF Report</span>
                        </button>

                        <button 
                            onClick={() => setFormat("excel")}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                format === "excel" 
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-green-300"
                            }`}
                        >
                            <FileSpreadsheet size={32} />
                            <span className="font-bold text-sm">Excel</span>
                        </button>
                    </div>

                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Period</span>
                            <span className="font-bold text-gray-900 dark:text-white">All Time</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Format</span>
                            <span className="font-bold text-gray-900 dark:text-white uppercase">{format}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleDownload}
                        className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                            format === "pdf" ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30" : "bg-green-600 hover:bg-green-500 shadow-green-500/30"
                        }`}
                    >
                        <Download size={20} /> Download {format === "pdf" ? "PDF" : "CSV"}
                    </button>
                </>
            )}

            {status === "generating" && (
                <div className="flex flex-col items-center py-8">
                    <div className="relative h-16 w-16 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                        <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${format === 'pdf' ? 'border-indigo-500' : 'border-green-500'}`}></div>
                    </div>
                    <p className="text-gray-900 dark:text-white font-bold animate-pulse">Generating {format.toUpperCase()}...</p>
                    <p className="text-xs text-gray-500">Compiling your financial data</p>
                </div>
            )}

            {status === "success" && (
                <div className="flex flex-col items-center py-8">
                    <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Downloaded!</h3>
                    <p className="text-sm text-gray-500">Check your files.</p>
                </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}