'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mal3abak.com';

interface Analysis {
  matchId: string;

  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };

  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };

  score: {
    home: number;
    away: number;
  };

  tournament: {
    id: number;
    name: string;
    logo: string;
  };

  venue?: string;
  date: string;

  analysis: {
    summary: string;
    fullText?: string;
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

      const res = await fetch(`${API_URL}/api/analysis/${matchId}`, {
        cache: 'no-store'
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'فشل تحميل التحليل');
      }

      setAnalysis(json.data);

    } catch (err: any) {
      console.log('❌ Fetch error:', err);
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
        <button
          onClick={() => router.push('/analysis')}
          className="mt-4 px-4 py-2 bg-gray-700 rounded"
        >
          رجوع
        </button>
      </div>
    );

  return (
    <div className="text-white p-4">

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

      <h3 className="text-xl font-bold mb-3">📊 ملخص التحليل</h3>

      <p className="text-gray-200 leading-loose whitespace-pre-line">
        {analysis.analysis.summary}
      </p>

    </div>
  );
}
