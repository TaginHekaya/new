import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.mal3abak.com/news?limit=1000", {
    next: { revalidate: 300 }, // كل 5 دقايق
  });

  const news = await res.json();

  const urls = news.map((item: any) => `
    <url>
      <loc>https://mal3abak.com/news/${item._id}</loc>
      <lastmod>${new Date(item.updatedAt || item.createdAt).toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
