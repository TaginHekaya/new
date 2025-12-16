export async function GET() {
  try {
    const res = await fetch("https://api.mal3abak.com/news", {
      next: { revalidate: 3600 },
    });

    const news = res.ok ? await res.json() : [];

    const urls = news.map(
      (n: any) => `
        <url>
          <loc>https://mal3abak.com/news/${n._id}</loc>
          <lastmod>${new Date(n.updatedAt).toISOString()}</lastmod>
        </url>
      `
    ).join("");

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
         ${urls}
       </urlset>`,
      { headers: { "Content-Type": "application/xml" } }
    );

  } catch (e) {
    // 👈 مهما حصل
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }
}
