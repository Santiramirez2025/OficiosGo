"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Email o contraseña incorrectos"); return; }
      router.push("/app/dashboard");
      router.refresh();
    } catch { setError("Error de conexión"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1D2E] to-[#252839] flex flex-col">
      <div className="pt-12 pb-8 text-center px-6">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="OficiosGo!" className="h-12 w-auto mx-auto mb-5" />
        </Link>
        <h1 className="text-2xl font-black text-white">Iniciar sesión</h1>
        <p className="text-sm text-gray-400 mt-1">Accedé a tu panel de profesional</p>
      </div>

      <div className="flex-1 bg-[#F5F5F7] rounded-t-[28px] px-6 pt-8 pb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">{error}</div>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 bg-white" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl bg-[#1A1D2E] text-[#F8C927] font-extrabold text-[15px] disabled:opacity-50">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="text-[#5C80BC] font-bold">Registrate gratis</Link>
        </p>

        <Link href="/" className="block text-center text-xs text-gray-400 mt-6 hover:text-gray-600">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}