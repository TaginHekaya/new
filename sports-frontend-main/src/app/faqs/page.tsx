export default function FAQsPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">الأسئلة الشائعة</h1>
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">ما هي منصة ملعبك؟</h2>
          <p>
            منصة رياضية لعرض أخبار ومباريات كرة القدم وتحديث النتائج أولاً بأول.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">كيف أتابع المباريات المفضلة؟</h2>
          <p>
            يمكنك إنشاء حساب وتفعيل الإشعارات لفرقك وبطولاتك المفضلة.
          </p>
        </div>
      </section>
    </main>
  );
}
