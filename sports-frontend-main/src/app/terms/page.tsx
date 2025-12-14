export const metadata = {
  title: "Terms & Conditions | Mal3abak",
  description:
    "شروط وأحكام Mal3abak: الحسابات، التعليقات واللايكات، المفضلة، الاستخدام المقبول، الملكية الفكرية، إخلاء المسؤولية وحدودها، وسياسة المخالفات.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-2">الشروط والأحكام</h1>
      <p className="text-white/70 mb-6">
        باستخدامك Mal3abak (الموقع/الخدمة) فإنك توافق على هذه الشروط. إذا لم توافق، يرجى عدم استخدام الخدمة.
      </p>

      <div className="space-y-8 text-white/80">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">1) حساب المستخدم</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>قد تتطلب بعض الميزات (التعليقات/اللايكات/المفضلة) تسجيل حساب.</li>
            <li>أنت مسؤول عن حماية بيانات دخولك وعن أي نشاط يتم عبر حسابك.</li>
            <li>يحق لنا تعليق أو إيقاف الحساب عند الاشتباه في نشاط ضار أو مخالف.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">2) التعليقات واللايكات (محتوى المستخدم)</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>أنت مسؤول قانونيًا عن أي محتوى تنشره (تعليقات/نصوص/روابط/أسماء).</li>
            <li>يُحظر نشر محتوى مسيء، تحريضي، تشهيري، عنصري، أو ينتهك خصوصية الآخرين أو حقوقهم.</li>
            <li>يحق لنا (دون التزام) مراجعة المحتوى وحذفه أو إخفاؤه أو تقييد الحساب عند المخالفة.</li>
            <li>
              بمنشورك للمحتوى على Mal3abak، تمنحنا ترخيصًا لاستخدامه وعرضه داخل الخدمة
              (مثل عرضه على صفحة الخبر/المباراة)، بالقدر اللازم لتشغيل المنصة.
            </li>
          </ul>
          <p className="text-white/70 text-sm">
            تضمين بنود “المحتوى الذي ينشئه المستخدم” والترخيص وإزالة المحتوى من أفضل الممارسات للمنصات التي تدعم التعليقات. [web:315]
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">3) الاستخدام المقبول ومنع إساءة الاستخدام</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>يُحظر استخدام Bots أو Scraping أو إرسال طلبات كثيفة تؤثر على استقرار الخدمة.</li>
            <li>يُحظر محاولة اختراق الخدمة أو تجاوز أنظمة الحماية أو الوصول غير المصرّح به.</li>
            <li>يُحظر نشر سبام أو روابط خادعة أو محتوى احتيالي.</li>
          </ul>
          <p className="text-white/70 text-sm">
            وجود سياسة “الاستخدام المقبول” وبنود منع السكريبينج/السبام شائع في خدمات كبيرة لحماية الأداء والأمان. [web:323][web:326]
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">4) المفضلة والتخصيص</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>ميزة “المفضلة” تحفظ تفضيلاتك (مثل فرق/بطولات) لتحسين التجربة.</li>
            <li>قد تتأثر المفضلة عند تسجيل الخروج أو حذف الحساب أو عند تحديثات النظام.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">5) الملكية الفكرية</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>تصميم الموقع والهوية وعناصر الواجهة مملوكة لـ Mal3abak أو مرخّصة له.</li>
            <li>قد تظهر شعارات وأسماء فرق/بطولات كعلامات تجارية لأصحابها.</li>
            <li>يُحظر نسخ أو إعادة نشر محتوى الموقع بشكل تجاري دون إذن.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">6) دقة البيانات الرياضية وإخلاء المسؤولية</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>
              قد تعتمد بيانات المباريات/النتائج/المواعيد على مصادر بيانات خارجية وقد يحدث تأخير أو اختلاف أو تغييرات رسمية.
            </li>
            <li>تُقدم الخدمة “كما هي” دون ضمان خلوها من الأخطاء أو الانقطاعات.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">7) حدود المسؤولية</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>إلى أقصى حد يسمح به القانون، لا نتحمل مسؤولية أي خسائر غير مباشرة ناتجة عن استخدام الخدمة.</li>
            <li>لا نتحمل مسؤولية محتوى المستخدمين المنشور في التعليقات.</li>
          </ul>
          <p className="text-white/70 text-sm">
            توضيح مسؤولية محتوى المستخدم مهم لتقليل المخاطر المرتبطة بالتعليقات. [web:315]
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">8) الإنهاء والحظر</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>يحق لنا حظر المستخدم أو حذف المحتوى أو تقييد الميزات عند مخالفة الشروط.</li>
            <li>قد نوقف الخدمة مؤقتًا للصيانة أو لأسباب أمنية.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">9) التعديلات على الشروط</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>قد نقوم بتحديث الشروط عند الحاجة.</li>
            <li>استمرار استخدامك للخدمة بعد التحديث يعني موافقتك على النسخة المحدّثة.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">10) التواصل</h2>
          <p>لو عندك سؤال عن الشروط، تواصل معنا عبر صفحة “تواصل معنا” أو البريد:</p>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="font-semibold text-white">support@mal3abak.com</p>
          </div>
        </section>

        <p className="text-white/60 text-xs">
          تنبيه: هذه الشروط نص عام لتحسين الوضوح، وليست استشارة قانونية. يفضّل مراجعتها قانونيًا قبل الإطلاق الرسمي.
        </p>
      </div>
    </main>
  );
}
