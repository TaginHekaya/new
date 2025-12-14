export const metadata = {
  title: "Terms & Conditions | Mal3abak",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4">الشروط والأحكام</h1>

      <div className="space-y-3 text-white/80">
        <p>باستخدامك للموقع فأنت توافق على هذه الشروط.</p>
        <ul className="list-disc ps-6 space-y-2">
          <li>المحتوى للاستخدام الشخصي فقط.</li>
          <li>يُمنع إساءة الاستخدام أو محاولة تعطيل الخدمة.</li>
          <li>قد يتم تحديث الشروط من وقت لآخر.</li>
        </ul>
        <p>لو عندك استفسار عن الشروط تواصل معنا.</p>
      </div>
    </main>
  );
}
