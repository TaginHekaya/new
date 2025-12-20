'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mal3abak.com';

interface Analysis {
  matchId: string;
  homeTeam: { id: number; name: string; logo: string };
  awayTeam: { id: number; name: string; logo: string };
  score: { home: number; away: number };
  tournament: { id: number; name: string; logo: string };
  venue?: string;
  date: string;
  analysis: {
    summary: string;
    fullText?: string;
    performance?: {
      homeTeam?: string;
      awayTeam?: string;
      overall?: string;
    };
    keyPlayers?: string;
    tactics?: {
      homeTeam?: string;
      awayTeam?: string;
      comparison?: string;
    };
    statistics?: string;
    strengths?: {
      homeTeam?: string[];
      awayTeam?: string[];
    };
    weaknesses?: {
      homeTeam?: string[];
      awayTeam?: string[];
    };
  };
  createdAt: string;
  likes?: number;
  views?: number;
}

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) fetchAnalysis(params.id as string);
  }, [params.id]);

  const fetchAnalysis = async (matchId: string) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/analysis/${matchId}`, { cache: 'no-store' });
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.message || 'فشل تحميل التحليل');

      setAnalysis(json.data);

    } catch (err: any) {
      setError(err.message || 'خطأ أثناء تحميل التحليل');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  if (loading)
    return <div className="text-white p-10 text-center">⏳ جاري تحميل التحليل…</div>;

  if (error || !analysis)
    return (
      <div className="text-red-400 text-center p-10">
        <p>{error}</p>
        <button onClick={() => router.push('/analysis')} className="mt-4 px-4 py-2 bg-gray-700 rounded">
          رجوع
        </button>
      </div>
    );

  const data = analysis.analysis;

  return (
    <div className="text-white p-4">

      {/* MATCH HEADER */}
      <h1 className="text-3xl font-bold text-center mb-4">
        {analysis.homeTeam.name} vs {analysis.awayTeam.name}
      </h1>

      <div className="flex justify-center gap-6 mb-6">
        <div className="text-center">
          <img src={analysis.homeTeam.logo} className="w-20 h-20 mx-auto mb-2" />
          <p>{analysis.homeTeam.name}</p>
        </div>

        <div className="text-center text-4xl font-bold">
          {analysis.score.home} - {analysis.score.away}
        </div>

        <div className="text-center">
          <img src={analysis.awayTeam.logo} className="w-20 h-20 mx-auto mb-2" />
          <p>{analysis.awayTeam.name}</p>
        </div>
      </div>

      <div className="text-center my-4 text-blue-300">
        {analysis.tournament.name} • {formatDate(analysis.date)}
      </div>

      <hr className="my-6 border-gray-700" />

      {/* SUMMARY */}
      <h3 className="text-xl font-bold mb-3">📊 ملخص التحليل</h3>
      <p className="text-gray-200 leading-loose whitespace-pre-line mb-6">
        {(data.fullText || data.summary).replace(/\*\*/g, '')}
      </p>

      <hr className="my-6 border-gray-700" />

      {/* PERFORMANCE */}
      {data.performance && (
        <>
          <h3 className="text-xl font-bold mb-3">⚽ تحليل الأداء</h3>
          <p className="text-gray-300 mb-2">🏠 {data.performance.homeTeam}</p>
          <p className="text-gray-300 mb-2">🛫 {data.performance.awayTeam}</p>
          <p className="text-gray-300 mb-4">📈 {data.performance.overall}</p>
        </>
      )}

      {/* KEY PLAYERS */}
      {data.keyPlayers && (
        <>
          <h3 className="text-xl font-bold mb-3">🌟 اللاعبون المؤثرون</h3>
          <p className="text-gray-300 mb-4 whitespace-pre-line">{data.keyPlayers}</p>
        </>
      )}

      {/* TACTICS */}
      {data.tactics && (
        <>
          <h3 className="text-xl font-bold mb-3">🎯 التكتيكات</h3>
          <p className="text-gray-300">🏠 {data.tactics.homeTeam}</p>
          <p className="text-gray-300">🛫 {data.tactics.awayTeam}</p>
          <p className="text-gray-300 mb-4">⚖️ {data.tactics.comparison}</p>
        </>
      )}

      {/* STATISTICS */}
      {data.statistics && (
        <>
          <h3 className="text-xl font-bold mb-3">📈 الإحصائيات</h3>
          <p className="text-gray-300 mb-4 whitespace-pre-line">{data.statistics}</p>
        </>
      )}

      {/* STRENGTHS & WEAKNESSES */}
      {(data.strengths || data.weaknesses) && (
        <>
          <h3 className="text-xl font-bold mb-3">💪 نقاط القوة والضعف</h3>

          {/* Strengths */}
          {data.strengths && (
            <div className="mb-4">
              <h4 className="font-bold text-green-400">نقاط القوة</h4>
              <p>🏠 {data.strengths.homeTeam?.join(' - ')}</p>
              <p>🛫 {data.strengths.awayTeam?.join(' - ')}</p>
            </div>
          )}

          {/* Weaknesses */}
          {data.weaknesses && (
            <div>
              <h4 className="font-bold text-red-400">نقاط الضعف</h4>
              <p>🏠 {data.weaknesses.homeTeam?.join(' - ')}</p>
              <p>🛫 {data.weaknesses.awayTeam?.join(' - ')}</p>
            </div>
          )}
        </>
      )}

      <br />
    </div>
  );
      }
