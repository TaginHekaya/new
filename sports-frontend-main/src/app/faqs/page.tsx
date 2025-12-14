export const metadata = {
  title: "FAQs | Mal3abak",
};

const faqs = [
  { q: "ما هو Mal3abak؟", a: "منصة لعرض أخبار ومباريات كرة القدم في مكان واحد." },
  { q: "هل الخدمة مجانية؟", a: "الاطلاع على المحتوى متاح، وقد تتغير بعض المزايا حسب التحديثات." },
  { q: "كيف أتواصل مع الدعم؟", a: "من صفحة تواصل معنا أو عبر البريد المخصص للدعم." },
];

export default function FAQsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4">الأسئلة الشائعة</h1>

      <div className="space-y-4">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <summary className="cursor-pointer font-semibold">{item.q}</summary>
            <p className="mt-2 text-white/80">{item.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
