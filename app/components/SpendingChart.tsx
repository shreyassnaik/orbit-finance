// app/components/SpendingChart.tsx
"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

export default function SpendingChart({ transactions }: { transactions: any[] }) {
  
  // LOGIC: Convert list of transactions into Weekly Data
  const data = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = days.map(day => ({ day, spent: 0 }));

    transactions.forEach(t => {
      if (!t.isIncome) { // Only count expenses
        const date = new Date(t.date);
        const dayName = days[date.getDay()];
        // Extract number from string (e.g. "-₹500" -> 500)
        const amount = parseFloat(t.amount.replace(/[^0-9.-]+/g,""));
        
        const dayEntry = chartData.find(d => d.day === dayName);
        if (dayEntry) {
          dayEntry.spent += Math.abs(amount); // Add to total
        }
      }
    });

    return chartData;
  }, [transactions]);

  return (
    <div className="mx-6 mt-4 rounded-3xl border border-slate-800 bg-[#0B1120] p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Weekly Insights</h3>
          <p className="text-xs text-gray-400">Real-time spending visualization</p>
        </div>
        <select className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-white border border-slate-700 outline-none">
          <option>This Week</option>
        </select>
      </div>

      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
                dataKey="day" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                borderColor: "#374151",
                borderRadius: "12px",
                color: "#fff",
              }}
              itemStyle={{ color: "#a78bfa" }}
              formatter={(value: number) => [`₹${value}`, "Spent"]}
            />
            <Area
              type="monotone"
              dataKey="spent"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSpent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}