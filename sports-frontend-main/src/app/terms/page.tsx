export default function TermsPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">الشروط والأحكام</h1>
      <p className="mb-2">
        استخدامك لمنصة ملعبك يعني موافقتك على هذه الشروط والأحكام.
      </p>
      <ul className="list-disc ps-6 space-y-2">
        <li>الخدمة مخصصة للاستخدام الشخصي وغير التجاري.</li>
        <li>يلتزم المستخدم بعدم إساءة استخدام المنصة أو محاولة اختراقها.</li>
        <li>قد نقوم بتحديث هذه الشروط من وقت لآخر بما يتناسب مع سياساتنا.</li>
      </ul>
    </main>
  );
}
