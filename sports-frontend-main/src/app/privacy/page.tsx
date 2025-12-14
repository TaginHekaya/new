export const metadata = {
  title: "Privacy Policy | Mal3abak",
  description:
    "سياسة الخصوصية الخاصة بـ Mal3abak: ما البيانات التي نجمعها، وكيف نستخدمها، وحقوق المستخدم، والكوكيز، وفترات الاحتفاظ بالبيانات.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-2">سياسة الخصوصية</h1>
      <p className="text-white/70 mb-6">
        توضّح هذه السياسة أنواع البيانات التي قد يتم جمعها عند استخدام Mal3abak، وكيفية استخدامها وحمايتها، والخيارات المتاحة للمستخدم.
      </p>

      <div className="space-y-8 text-white/80">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">1) نطاق السياسة</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>تنطبق هذه السياسة على موقع Mal3abak وأي صفحات/خدمات مرتبطة به.</li>
            <li>قد نقوم بتحديث هذه السياسة من وقت لآخر، وسيتم نشر النسخة المحدّثة على هذه الصفحة.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">2) البيانات التي قد نجمعها</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>بيانات تُدخلها بنفسك: مثل الاسم والبريد الإلكتروني عند التواصل معنا أو إنشاء حساب (إن وُجد).</li>
            <li>بيانات استخدام تقنية: مثل نوع المتصفح، صفحات تمت زيارتها، وقت الوصول، ومعرّفات تقنية لأغراض الأمان وتحسين الأداء.</li>
            <li>تفضيلات المحتوى: مثل الفرق/البطولات المفضلة (إن كانت ميزة التخصيص متاحة).</li>
          </ul>
          <p className="text-white/70 text-sm">
            ملاحظة: يتم تقليل جمع البيانات قدر الإمكان إلى ما يلزم لتشغيل الخدمة وتحسينها (مبدأ تقليل البيانات).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">3) كيف نستخدم البيانات</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>تشغيل الخدمة وعرض المحتوى بشكل صحيح.</li>
            <li>تحسين تجربة المستخدم والأداء وإصلاح الأعطال.</li>
            <li>الرد على رسائلك وطلبات الدعم.</li>
            <li>الحماية من إساءة الاستخدام والطلبات الضارة (مكافحة السبام/الهجمات).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">4) ملفات تعريف الارتباط (Cookies) والتتبّع</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>قد نستخدم Cookies ضرورية لتشغيل الموقع (مثل الحفاظ على الجلسة/الإعدادات).</li>
            <li>قد نستخدم أدوات قياس وتحليلات لتحسين الأداء وفهم الاستخدام (إن كانت مفعّلة).</li>
            <li>يمكنك التحكم في ملفات Cookies من إعدادات المتصفح، وقد يؤثر تعطيل بعض الأنواع على تجربة الاستخدام.</li>
          </ul>
          <p className="text-white/70 text-sm">
            الإفصاح عن الكوكيز وأغراضها من أفضل الممارسات، وقد يتطلب في بعض الدول آلية موافقة على غير الضروري منها.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">5) مشاركة البيانات مع أطراف أخرى</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>لا نقوم ببيع بياناتك الشخصية.</li>
            <li>
              قد نشارك بيانات محدودة مع مزودي خدمات موثوقين (استضافة/حماية/قياس) فقط بالقدر اللازم لتشغيل الخدمة،
              ومع التزامهم بحماية البيانات.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">6) الاحتفاظ بالبيانات</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>نحتفظ بالبيانات للمدة اللازمة لتقديم الخدمة وتحقيق الأغراض المذكورة أعلاه.</li>
            <li>قد نحتفظ ببعض السجلات لفترة أطول إذا كان ذلك مطلوبًا لأسباب أمنية أو قانونية.</li>
          </ul>
          <p className="text-white/70 text-sm">
            إضافة بند “الاحتفاظ بالبيانات” يعتبر من أفضل الممارسات في سياسات الخصوصية.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">7) حماية البيانات</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>نستخدم إجراءات أمنية معقولة لحماية البيانات من الوصول غير المصرّح به.</li>
            <li>رغم ذلك، لا يمكن ضمان أمان الإنترنت بنسبة 100%، لذلك ننصح بعدم إرسال معلومات شديدة الحساسية عبر نموذج التواصل.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">8) حقوق المستخدم</h2>
          <ul className="list-disc ps-6 space-y-2">
            <li>يمكنك طلب الوصول إلى بياناتك أو تصحيحها (إن وُجدت).</li>
            <li>يمكنك طلب حذف بياناتك أو إيقاف استخدام بياناتك لأغراض معينة، وفقًا للمتاح قانونيًا وتقنيًا.</li>
            <li>يمكنك سحب موافقتك على بعض عمليات المعالجة عندما يكون ذلك قابلًا للتطبيق.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">9) التواصل معنا</h2>
          <p>
            لأي استفسار بخصوص الخصوصية أو لطلب تحديث/حذف بياناتك، تواصل عبر صفحة “تواصل معنا” أو عبر:
          </p>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-white/80">البريد الإلكتروني:</p>
            <p className="font-semibold text-white">support@mal3abak.com</p>
          </div>
        </section>
      </div>
    </main>
  );
          }
