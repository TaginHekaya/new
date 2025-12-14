'use client';

import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setDone(null);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");
      setDone("تم إرسال رسالتك بنجاح. هنرد عليك في أقرب وقت.");
      (e.target as HTMLFormElement).reset();
    } catch {
      setError("حصلت مشكلة أثناء الإرسال. جرّب تاني أو ابعت على support@mal3abak.com");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-2">تواصل معنا</h1>
      <p className="text-white/70 mb-6">
        اكتب لنا اقتراحك أو مشكلتك، وسيتم الرد في أقرب وقت.
      </p>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <input name="name" required placeholder="الاسم" className="w-full rounded-md bg-black/20 border border-white/10 p-3" />
        <input name="email" type="email" required placeholder="البريد الإلكتروني" className="w-full rounded-md bg-black/20 border border-white/10 p-3" />
        <input name="subject" required placeholder="عنوان الرسالة" className="w-full rounded-md bg-black/20 border border-white/10 p-3" />
        <textarea name="message" required placeholder="اكتب رسالتك..." rows={5} className="w-full rounded-md bg-black/20 border border-white/10 p-3" />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 p-3 font-semibold"
        >
          {loading ? "جاري الإرسال..." : "إرسال"}
        </button>

        {done && <p className="text-green-400 text-sm">{done}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>

      <div className="mt-6 text-sm text-white/70">
        أو راسلنا مباشرة: <span className="font-semibold">support@mal3abak.com</span>
      </div>
    </main>
  );
}
