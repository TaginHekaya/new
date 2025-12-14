export const metadata = {
  title: "Contact | Mal3abak",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4">تواصل معنا</h1>

      <p className="text-white/80 mb-6">
        اكتب لنا اقتراحك أو مشكلتك، وسيتم الرد في أقرب وقت.
      </p>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
        <p className="text-white/80">البريد الإلكتروني (عدّله لبياناتك):</p>
        <p className="font-semibold">support@mal3abak.com</p>
      </div>
    </main>
  );
}
