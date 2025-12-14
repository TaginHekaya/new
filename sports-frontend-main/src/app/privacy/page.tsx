export const metadata = {
  title: "Privacy Policy | Mal3abak",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4">سياسة الخصوصية</h1>

      <div className="space-y-3 text-white/80">
        <p>تهدف هذه السياسة لتوضيح كيفية التعامل مع بيانات المستخدم.</p>
        <ul className="list-disc ps-6 space-y-2">
          <li>قد نجمع بيانات أساسية لتحسين التجربة (مثل التفضيلات).</li>
          <li>لا يتم بيع البيانات لطرف ثالث.</li>
          <li>يمكنك طلب تحديث/حذف بياناتك عبر صفحة التواصل.</li>
        </ul>
      </div>
    </main>
  );
}
