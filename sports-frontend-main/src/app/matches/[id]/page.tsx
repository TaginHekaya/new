// sports-frontend-main/src/app/matches/[id]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 60;

import React from "react";
import type { Metadata } from "next";
import { API_BASE } from "@/lib/api";
import Header from "@/components/Header";
import FooterGate from "@/components/FooterGate";

interface PageParams {
  params: {
    id: string;
  };
}

type TeamInfo = {
  name: string;
  logo?: string;
  id?: number | string;
};

type MatchApi = {
  _id: string;
  apiId?: number;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  scoreA?: number;
  scoreB?: number;
  date?: string;
  status?: string;
  minute?: number;
  isLive?: boolean;
  venue?: string;
  tournament?: {
    id?: number;
    name?: string;
    country?: string;
  };
  // optional fields from DB
  events?: any[];
  statistics?: any;
  lineups?: any;
};

// Helper - safe absolute image URL for OG & logos
function getAbsoluteImageUrl(imageUrl?: string) {
  const fallback = `${API_BASE}/default-team.png`;
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  if (imageUrl.startsWith("/")) return `${API_BASE}${imageUrl}`;
  return `${API_BASE}/${imageUrl}`;
}

function cleanText(str?: string, max = 160) {
  if (!str) return "";
  return str.replace(/\s+/g, " ").trim().slice(0, max);
}

// ---------- Metadata generator ----------
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { id } = params;
  try {
    const res = await fetch(`${API_BASE}/api/matches/${id}`, { cache: "no-store" });
    if (!res.ok) {
      return {
        title: "Match Not Found | Mal3abak",
        description: "Match details unavailable.",
        robots: { index: false, follow: false },
      };
    }

    const match: MatchApi = await res.json();
    const title = `${match.homeTeam?.name || "Home"} vs ${match.awayTeam?.name || "Away"} — ${match.tournament?.name || "Match"}`;
    const description = match.isLive
      ? `Live: ${match.homeTeam.name} ${match.scoreA ?? 0} - ${match.scoreB ?? 0} ${match.awayTeam.name}. ${match.minute ? match.minute + "'" : ""}`
      : `Match on ${new Date(match.date || "").toLocaleString()}: ${match.homeTeam.name} vs ${match.awayTeam.name}.`;

    const image = match.homeTeam?.logo ? getAbsoluteImageUrl(match.homeTeam.logo) : getAbsoluteImageUrl(match.awayTeam?.logo);

    const canonical = `https://mal3abak.com/matches/${id}`;

    return {
      title,
      description: cleanText(description, 160),
      alternates: { canonical },
      openGraph: {
        title,
        description: cleanText(description, 160),
        url: canonical,
        type: "website",
        siteName: "Mal3abak",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: cleanText(description, 160),
        images: [image],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (err) {
    return {
      title: "Mal3abak - Match",
      description: "Live & upcoming football matches — Mal3abak",
    };
  }
}

// ---------- Page (server) ----------
export default async function Page({ params }: PageParams) {
  const { id } = params;
  const matchUrl = `${API_BASE}/api/matches/${id}`;

  // multiple endpoints
  const eventsUrl = `${API_BASE}/api/football/events/${id}`;
  const statsUrl = `${API_BASE}/api/football/statistics/${id}`;
  const lineupsUrl = `${API_BASE}/api/football/lineups/${id}`;

  // fetch main match + extras in parallel (best-effort)
  const [matchRes, eventsRes, statsRes, lineupsRes] = await Promise.allSettled([
  fetch(matchUrl, { cache: "no-store" }),
  fetch(eventsUrl, { cache: "no-store" }),
  fetch(statsUrl, { cache: "no-store" }),
  fetch(lineupsUrl, { cache: "no-store" }),
]);

  if (matchRes.status === "rejected" || (matchRes.status === "fulfilled" && !matchRes.value.ok)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Match not found</h1>
          <p className="text-sm text-gray-600 mt-2">We couldn't find the requested match.</p>
        </main>
        <FooterGate />
      </div>
    );
  }

  const matchData: MatchApi = (await (matchRes as PromiseFulfilledResult<Response>).value.json()) as MatchApi;

  // parse extras
  const events = (eventsRes.status === "fulfilled" && eventsRes.value.ok) ? await eventsRes.value.json() : [];
  const statistics = (statsRes.status === "fulfilled" && statsRes.value.ok) ? await statsRes.value.json() : null;
  const lineups = (lineupsRes.status === "fulfilled" && lineupsRes.value.ok) ? await lineupsRes.value.json() : null;

  // JSON-LD structured data for SportsEvent
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${matchData.homeTeam.name} vs ${matchData.awayTeam.name}`,
    startDate: matchData.date,
    location: matchData.venue || undefined,
    competitor: [
      { "@type": "SportsTeam", name: matchData.homeTeam.name, url: getAbsoluteImageUrl(matchData.homeTeam.logo) },
      { "@type": "SportsTeam", name: matchData.awayTeam.name, url: getAbsoluteImageUrl(matchData.awayTeam.logo) },
    ],
    description: matchData.isLive
      ? `Live now — ${matchData.homeTeam.name} ${matchData.scoreA ?? 0} - ${matchData.scoreB ?? 0} ${matchData.awayTeam.name}.`
      : `Kick-off: ${new Date(matchData.date || "").toLocaleString()}`,
    eventStatus: matchData.isLive ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled",
    url: `https://mal3abak.com/matches/${id}`,
  };

  // Some derived text for page header
  const pageTitle = `${matchData.homeTeam.name} vs ${matchData.awayTeam.name}`;
  const scoreText = `${matchData.scoreA ?? 0} - ${matchData.scoreB ?? 0}`;
  const statusText = matchData.isLive ? (matchData.minute ? `${matchData.minute}'` : "LIVE") : (matchData.status || "Scheduled");
  const ogImage = matchData.homeTeam.logo ? getAbsoluteImageUrl(matchData.homeTeam.logo) : getAbsoluteImageUrl(matchData.awayTeam.logo);

  // Render server-side HTML
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{pageTitle}</h1>
                <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  {matchData.tournament?.name ? `${matchData.tournament.name} • ${matchData.tournament.country || ""}` : "Friendly"}
                  {" • "}
                  {new Date(matchData.date || "").toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-3">
                  <div className="text-center">
                    <img src={getAbsoluteImageUrl(matchData.homeTeam.logo)} alt={matchData.homeTeam.name} className="w-12 h-12 object-contain" />
                    <div className="text-xs mt-1">{matchData.homeTeam.name}</div>
                  </div>

                  <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="text-lg font-bold text-center">{scoreText}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 text-center mt-0.5">{statusText}</div>
                  </div>

                  <div className="text-center">
                    <img src={getAbsoluteImageUrl(matchData.awayTeam.logo)} alt={matchData.awayTeam.name} className="w-12 h-12 object-contain" />
                    <div className="text-xs mt-1">{matchData.awayTeam.name}</div>
                  </div>
                </div>
                <div className="mt-2 text-right text-xs text-gray-500 dark:text-slate-400">{matchData.venue}</div>
              </div>
            </div>
          </div>

          {/* Main layout: left details (events), right stats/lineups */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Events */}
            <section className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Match Events</h2>
                  <div className="text-xs text-gray-500 dark:text-slate-400">{events?.length ?? 0} events</div>
                </div>

                {(!events || events.length === 0) ? (
                  <div className="text-sm text-gray-500 py-6 text-center">No events available yet.</div>
                ) : (
                  <ul className="space-y-3">
                    {events.map((ev: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-10 text-xs text-gray-600 dark:text-slate-400">{ev.time?.elapsed ? `${ev.time.elapsed}'` : ev.time?.display || ""}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">{ev.team?.name || ev.side || ""} {ev.player?.name ? `• ${ev.player.name}` : ""}</div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">{ev.detail || ev.type}</div>
                          </div>
                          {ev.assist && <div className="text-xs text-gray-500 mt-1">Assist: {ev.assist.name}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Lineups */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Lineups</h2>
                  <div className="text-xs text-gray-500 dark:text-slate-400">{lineups ? "Loaded" : "No lineups"}</div>
                </div>

                {lineups && lineups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lineups.map((teamLine: any, tIdx: number) => (
                      <div key={tIdx} className="p-2 border rounded">
                        <div className="text-sm font-medium mb-2">{teamLine.side || (tIdx === 0 ? matchData.homeTeam.name : matchData.awayTeam.name)}</div>
                        <ul className="text-sm space-y-1">
                          {(teamLine.startXI || []).map((p: any, i: number) => (
                            <li key={i} className="flex items-center justify-between">
                              <span>{p.player?.name || p.name}</span>
                              <span className="text-xs text-gray-500">{p.number ?? ""}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Lineups not available yet.</div>
                )}
              </div>
            </section>

            {/* Right column: Stats & share */}
            <aside className="space-y-4">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">Match Statistics</h3>
                {!statistics ? (
                  <div className="text-sm text-gray-500">Statistics not available.</div>
                ) : (
                  <div className="space-y-2 text-sm">
                    {/* Render a few common stats if present */}
                    {statistics.ballPossession && (
                      <div className="flex justify-between">
                        <div className="text-xs">{matchData.homeTeam.name}</div>
                        <div className="text-xs font-semibold">{statistics.ballPossession.home ?? statistics.ballPossession}</div>
                        <div className="text-xs">{matchData.awayTeam.name}</div>
                      </div>
                    )}
                    {statistics.shots && (
                      <div className="flex justify-between">
                        <div className="text-xs">{statistics.shots?.on ?? statistics.shots?.total ?? "-"}</div>
                        <div className="text-xs font-semibold">Shots</div>
                        <div className="text-xs">{statistics.shots?.away ?? "-"}</div>
                      </div>
                    )}
                    {/* Generic key/values fallback */}
                    {statistics && !statistics.ballPossession && !statistics.shots && (
                      <pre className="text-xs text-gray-500 overflow-auto max-h-40">{JSON.stringify(statistics, null, 2)}</pre>
                    )}
                  </div>
                )}
              </div>

              {/* Share / OG preview */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border text-center">
                <img src={ogImage} alt="team" className="w-full h-28 object-contain mb-3 rounded" />
                <div className="text-sm font-medium">{pageTitle}</div>
                <div className="text-xs text-gray-500 mt-1">Share this match</div>
                <div className="flex gap-2 justify-center mt-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://mal3abak.com/matches/${id}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${pageTitle} — ${scoreText} — Mal3abak`)}&url=${encodeURIComponent(`https://mal3abak.com/matches/${id}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded bg-sky-500 text-white text-sm"
                  >
                    Twitter
                  </a>
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border text-sm">
                <div className="mb-2 font-medium">Quick links</div>
                <ul className="text-xs space-y-1">
                  <li><a href="/matches" className="text-blue-500">All matches</a></li>
                  <li><a href={`/tournaments/${matchData.tournament?.id || ""}`} className="text-blue-500">Tournament</a></li>
                </ul>
              </div>
            </aside>
          </div>
        </main>

        <FooterGate />
      </div>
    </>
  );
}
