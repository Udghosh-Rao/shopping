"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      toast.success("Welcome back! 🎉");
      router.push("/");
    } else {
      toast.error("Wrong email or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-[#0A0A0A] items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {["DRIP", "STYLE", "VIBE", "FRESH"].map((word, i) => (
            <div
              key={word}
              className="absolute text-white font-black text-8xl select-none"
              style={{ top: `${i * 28}%`, left: `${i * 10 - 5}%`, transform: "rotate(-15deg)" }}
            >
              {word}
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-[#E63946] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="text-white" fill="white" />
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mb-4">
            YOUR STYLE,<br />YOUR RULES
          </h2>
          <p className="text-gray-400 text-lg">India&apos;s freshest streetwear brand</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-1.5 mb-8">
              <div className="w-7 h-7 bg-[#E63946] rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="text-xl font-black">
                DRIP<span className="text-[#E63946]">STORE</span>
              </span>
            </Link>
            <h1 className="text-3xl font-black tracking-tight mb-1">WELCOME BACK 👋</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-200 rounded-2xl font-bold text-sm hover:border-[#0A0A0A] hover:bg-gray-50 transition-all mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black tracking-widest text-gray-400 mb-2">EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black tracking-widest text-gray-400 mb-2">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0A0A0A] text-white font-black text-sm tracking-widest rounded-2xl hover:bg-[#E63946] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "SIGNING IN..." : "LET'S GO →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            New here?{" "}
            <Link href="/signup" className="font-black text-[#0A0A0A] hover:text-[#E63946] transition-colors">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
