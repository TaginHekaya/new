export const metadata = {
  title: "FAQs | Mal3abak",
  description:
    "إجابات سريعة عن الأخبار والمباريات، دقة التحديثات، الإشعارات، الحساب، والدعم في Mal3abak.",
};

type FaqItem = {
  q: string;
  a: string;
  links?: { label: string; href: string }[];
};

type FaqSection = {
  title: string;
  items: FaqItem[];
};

const sections: FaqSection[] = [
  {
    title: "عن Mal3abak",
    items: [
      {
        q: "ما هو Mal3abak؟",
        a: "منصة لمتابعة أخبار كرة القدم وجدول المباريات والنتائج، مع صفحات للفرق والبطولات حسب المتاح في الموقع.",
      },
      {
        q: "هل Mal3abak تطبيق أم موقع؟",
        a: "يمكن استخدامه كموقع، وقد تتوفر تجربة تطبيق/موبايل حسب الإصدارات والتحديثات.",
      },
      {
        q: "هل الخدمة مجانية؟",
        a: "التصفح متاح، وقد تتغير بعض المزايا أو طرق العرض مع التحديثات المستقبلية.",
      },
    ],
  },
  {
    title: "الأخبار والمباريات",
    items: [
      {
        q: "هل النتائج والتوقيتات دقيقة 100%؟",
        a: "تُعرض البيانات بناءً على مصادر بيانات رياضية، وقد يحدث تأخير بسيط أو اختلاف لحظي أثناء المباريات أو عند تغيير الموعد رسميًا.",
      },
      {
        q: "لماذا أحيانًا يتأخر تحديث المباراة؟",
        a: "التأخير قد يحدث بسبب تأخر مصدر البيانات أو ضغط الشبكة أو تحديثات النظام. عند حدوث ذلك ستظهر البيانات فور وصولها.",
      },
      {
        q: "هل يمكن متابعة بطولة/فريق معين فقط؟",
        a: "حسب الميزات المتاحة، يمكن التنقل لصفحات البطولات والفرق ومتابعة ما يهمك عبر الأقسام المختلفة.",
      },
    ],
  },
  {
    title: "الحساب والإشعارات",
    items: [
      {
        q: "هل لازم أسجل حساب؟",
        a: "ليس دائمًا. التسجيل قد يكون مطلوبًا لبعض المزايا مثل تخصيص التجربة أو المزامنة عبر الأجهزة (إن كانت مفعلة).",
      },
      {
        q: "كيف أفعّل إشعارات فريق/مباراة؟",
        a: "لو ميزة الإشعارات مفعلة في نسختك، ستجدها داخل إعدادات الحساب أو صفحة الفريق/المباراة. إن لم تظهر، فالميزة غير متاحة حاليًا.",
      },
    ],
  },
  {
    title: "الدعم والسياسات",
    items: [
      {
        q: "كيف أتواصل مع الدعم؟",
        a: "يمكنك التواصل من صفحة تواصل معنا، أو عبر البريد الإلكتروني المخصص للدعم.",
        links: [
          { label: "تواصل معنا", href: "/contact" },
          { label: "سياسة الخصوصية", href: "/privacy" },
          { label: "الشروط والأحكام", href: "/terms" },
        ],
      },
      {
        q: "كيف أبلغ عن خطأ في نتيجة/موعد مباراة؟",
        a: "أرسل رابط الصفحة أو اسم المباراة + وقت المشكلة من صفحة التواصل، وسيتم مراجعتها.",
        links: [{ label: "إرسال بلاغ", href: "/contact" }],
      },
      {
        q: "هل يتم بيع بياناتي؟",
        a: "لا. الهدف هو تحسين التجربة وتشغيل الخدمة. لمزيد من التفاصيل راجع صفحة سياسة الخصوصية.",
        links: [{ label: "سياسة الخصوصية", href: "/privacy" }],
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">الأسئلة الشائعة</h1>
        <p className="mt-2 text-white/70">
          ابحث عن إجابات سريعة، ولو سؤالك مش موجود ابعتلنا من صفحة التواصل.
        </p>
      </header>

      <div className="space-y-6">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <h2 className="text-base font-semibold mb-3">{section.title}</h2>

            <div className="space-y-3">
              {section.items.map((item) => (
                <details
                  key={item.q}
                  className="rounded-lg border border-white/10 bg-black/20 p-4"
                >
                  <summary className="cursor-pointer font-semibold">
                    {item.q}
                  </summary>

                  <div className="mt-2 text-white/80 space-y-3">
                    <p>{item.a}</p>

                    {!!item.links?.length && (
                      <div className="flex flex-wrap gap-2">
                        {item.links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            className="text-sm text-blue-400 hover:text-blue-300 underline"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
