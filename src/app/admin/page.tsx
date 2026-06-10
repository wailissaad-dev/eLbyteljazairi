import type { Metadata } from "next";
import { adminConfigured, isAuthed } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "لوحة التحكم — البيت الجزائري",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const dbOk = isSupabaseConfigured();
  const pwOk = adminConfigured();

  if (!dbOk || !pwOk) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg-primary px-4 text-ink-primary">
        <div className="glass max-w-md rounded-2xl p-8 text-center">
          <h1 className="mb-3 font-display text-2xl font-bold text-gold">إعداد لوحة التحكم</h1>
          <p className="mb-4 font-body text-sm text-ink-secondary">
            لتفعيل لوحة التحكم، اضبط المتغيّرات التالية في ملف{" "}
            <code className="text-gold">.env.local</code> ثم أعد التشغيل:
          </p>
          <ul className="space-y-2 text-start font-label text-sm">
            <li className={pwOk ? "text-gold" : "text-ink-secondary"}>
              {pwOk ? "✓" : "•"} ADMIN_PASSWORD
            </li>
            <li className={dbOk ? "text-gold" : "text-ink-secondary"}>
              {dbOk ? "✓" : "•"} NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
            </li>
          </ul>
          <p className="mt-5 font-body text-xs text-ink-secondary">
            وشغّل ملفات supabase/migrations على مشروع Supabase.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthed()) return <AdminLogin />;
  return <AdminDashboard />;
}
