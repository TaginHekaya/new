export default function PrivacyPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">سياسة الخصوصية</h1>
      <p className="mb-2">
        نحرص في ملعبك على حماية بياناتك الشخصية واستخدامها فقط لتحسين تجربتك.
      </p>
      <ul className="list-disc ps-6 space-y-2">
        <li>قد نجمع بعض البيانات مثل الاسم والبريد وفرقك المفضلة عند التسجيل.</li>
        <li>لا نقوم ببيع بياناتك لطرف ثالث، ونستخدمها فقط لأغراض الخدمة.</li>
        <li>
          يمكنك التواصل معنا في أي وقت لطلب تحديث أو حذف بياناتك من أنظمتنا.
        </li>
      </ul>
    </main>
  );
}
