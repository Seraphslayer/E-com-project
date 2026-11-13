import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { api, setToken } from "../../lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api<{ token: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      setToken(res.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F1F1] flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-[#E2E2E2] p-6 sm:p-8">
        <div className="w-12 h-12 bg-[#EACD51] flex items-center justify-center mb-5">
          <Lock size={20} className="text-[#0D0D0D]" />
        </div>
        <p className="font-mono text-[11px] text-[#6B6B6B] tracking-widest uppercase mb-1">FGT Trading OPC</p>
        <h1 className="font-display font-bold text-2xl text-[#0D0D0D] mb-6">Admin sign in</h1>

        <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">Email</label>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#E2E2E2] px-3 py-2.5 text-sm outline-none focus:border-[#D4B63A] mb-4"
        />
        <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">Password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#E2E2E2] px-3 py-2.5 text-sm outline-none focus:border-[#D4B63A] mb-4"
        />
        {error && <p className="font-mono text-xs text-[#DC2626] bg-[#FEF2F2] px-3 py-2 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#EACD51] text-[#0D0D0D] py-3 font-mono text-sm tracking-widest uppercase hover:bg-[#D4B63A] transition-colors disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <button
          type="button"
          onClick={() => window.location.assign(import.meta.env.VITE_STORE_URL || "/store")}
          className="w-full mt-3 font-mono text-[11px] text-[#6B6B6B] hover:text-[#0D0D0D] tracking-wide"
        >
          Back to site
        </button>
      </form>
    </div>
  );
}
