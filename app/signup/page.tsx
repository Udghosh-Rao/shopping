"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("You're in! Welcome 🎉");
      router.push("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-[#F8F5F0]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
        <Link href="/" className="flex items-center gap-1.5 mb-8">
          <div className="w-7 h-7 bg-[#E63946] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="text-xl font-black">
            DRIP<span className="text-[#E63946]">STORE</span>
          </span>
        </Link>

        <h1 className="text-3xl font-black tracking-tight mb-1">JOIN THE DRIP 🔥</h1>
        <p className="text-gray-400 mb-8 text-sm">Create your account — it&apos;s free</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-200 rounded-2xl font-bold text-sm hover:border-[#0A0A0A] transition-all mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </button>

        <div className="relative flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-semibold">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "YOUR NAME", key: "name", type: "text", placeholder: "Arjun Sharma" },
            { label: "EMAIL", key: "email", type: "email", placeholder: "you@example.com" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-black tracking-widest text-gray-400 mb-2">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-black tracking-widest text-gray-400 mb-2">PASSWORD</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                minLength={8}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors pr-12"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#E63946] text-white font-black text-sm tracking-widest rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "CREATING..." : "CREATE ACCOUNT 🚀"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-black text-[#0A0A0A] hover:text-[#E63946] transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
