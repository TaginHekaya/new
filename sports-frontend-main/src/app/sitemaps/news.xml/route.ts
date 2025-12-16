// app/server-sitemap-news.xml/route.ts (مثال)
// Next.js Route Handler

const SITE = "https://mal3abak.com";

function esc(str: string) {
  // مهم لأن XML لازم يكون escaped. [web:11]
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  try {
    const res = await fetch("https://api.mal3abak.com/news", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    const news: any[] = res.ok ? await res.json() : [];

    const urls = news
      .map((n) => {
        const loc = `${SITE}/news/${n._id}`;
        const lastmod = n.updatedAt ? new Date(n.updatedAt).toISOString() : null;

        // hreflang alternates (اختياري)
        // n.alternates مثال:
        // [{ lang: "ar", url: "https://mal3abak.com/news/1" }, { lang: "en", url: "..." }]
        const alternatesXml = Array.isArray(n.alternates)
          ? n.alternates
              .map(
                (a: any) =>
                  `<xhtml:link rel="alternate" hreflang="${esc(a.lang)}" href="${esc(
                    a.url
                  )}" />`
              )
              .join("")
          : "";

        // images (اختياري)
        // n.images مثال: ["https://.../img1.jpg", ...]
        const imagesXml = Array.isArray(n.images)
          ? n.images
              .map(
                (img: string) =>
                  `<image:image><image:loc>${esc(img)}</image:loc></image:image>`
              )
              .join("")
          : "";

        // video (اختياري) — محتاج metadata
        const videosXml = Array.isArray(n.videos)
          ? n.videos
              .map(
                (v: any) => `<video:video>
  <video:thumbnail_loc>${esc(v.thumbnail)}</video:thumbnail_loc>
  <video:title>${esc(v.title)}</video:title>
  <video:description>${esc(v.description)}</video:description>
  <video:player_loc>${esc(v.playerUrl)}</video:player_loc>
</video:video>`
              )
              .join("")
          : "";

        // news extension (اختياري) — مفيد لو بتستهدف Google News وبياناتك جاهزة
        // n.news مثال: { publicationName, language, publicationDate, title }
        const newsXml = n.news
          ? `<news:news>
  <news:publication>
    <news:name>${esc(n.news.publicationName)}</news:name>
    <news:language>${esc(n.news.language)}</news:language>
  </news:publication>
  <news:publication_date>${esc(n.news.publicationDate)}</news:publication_date>
  <news:title>${esc(n.news.title)}</news:title>
</news:news>`
          : "";

        return `<url>
  <loc>${esc(loc)}</loc>
  ${lastmod ? `<lastmod>${esc(lastmod)}</lastmod>` : ""}
  ${newsXml}
  ${videosXml}
  ${imagesXml}
  ${alternatesXml}
</url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    // fallback XML صالح
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;

    return new Response(xml, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
    }
