"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (r.ok) {
        window.location.reload();
        return;
      }
      setErr("كلمة المرور غير صحيحة");
    } catch {
      setErr("تعذّر الاتصال");
    }
    setLoading(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-bg-primary px-4 text-ink-primary">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-2xl p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-gold/40 text-gold">
            <Lock size={18} />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-gold">لوحة التحكم</h1>
            <p className="font-body text-xs text-ink-secondary">البيت الجزائري</p>
          </div>
        </div>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="كلمة المرور"
          className="form-input mb-3"
          autoFocus
        />
        {err && <p className="mb-3 font-body text-sm text-red-400">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-gold min-h-[48px] w-full rounded-lg py-3 font-label disabled:opacity-60"
        >
          {loading ? "..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
