// app/components/LoginScreen.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Loader2, AlertCircle } from "lucide-react"; 
import { auth, db } from "../lib/firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // LOGIN
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // SIGN UP
        const res = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save User with 0 Balance initially
        await setDoc(doc(db, "users", res.user.uid), {
          name: name,
          email: email,
          balance: 0,
          currency: "INR",
          createdAt: new Date().toISOString()
        });
      }
      onLogin(); 
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 mb-10"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-2xl">
          <Fingerprint className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">ORBIT</h1>
        <p className="text-sm text-gray-400">Secure. Native. Real-time.</p>
      </motion.div>

      <form onSubmit={handleAuth} className="w-full space-y-4">
        {!isLogin && (
          <input 
            suppressHydrationWarning
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-gray-900/50 border border-gray-800 p-4 text-white outline-none focus:border-indigo-500 transition-all"
            required
          />
        )}
        <input 
          suppressHydrationWarning
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl bg-gray-900/50 border border-gray-800 p-4 text-white outline-none focus:border-indigo-500 transition-all"
          required
        />
        <input 
          suppressHydrationWarning
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl bg-gray-900/50 border border-gray-800 p-4 text-white outline-none focus:border-indigo-500 transition-all"
          required
        />

        {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-3 rounded-lg">
                <AlertCircle size={14} /> {error}
            </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white py-4 font-bold text-black transition-all hover:scale-[1.02] disabled:opacity-50 flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
        </button>
      </form>

      <p className="mt-6 text-xs text-gray-500">
        {isLogin ? "New to Orbit? " : "Already have an account? "}
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 hover:text-white font-bold">
            {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
    </div>
  );
}