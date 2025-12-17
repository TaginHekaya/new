'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Analysis {
  _id: string;
  matchId: string;
  homeTeam: {
    name: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    logo: string;
  };
  score: {
    home: number;
    away: number;
  };
  tournament: {
    name: string;
    country: string;
    logo: string;
  };
  venue: string;
  date: string;
  analysis: {
    summary: string;
    performance?: {
      overall: string;
      homeTeam: string;
      awayTeam: string;
    };
    keyPlayers?: string;
    tactics?: {
      homeTeam: string;
      awayTeam: string;
      comparison: string;
    };
    statistics?: string;
    fullText: string;
  };
  views: number;
  likes: number;
  createdAt: string;
}

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchAnalysis(params.id as string);
    }
  }, [params.id]);

  const fetchAnalysis = async (matchId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analysis/${matchId}`);
      
      if (!response.ok) throw new Error('Analysis not found');
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('فشل في تحميل التحليل');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">جاري تحميل التحليل...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={() => router.push('/analysis')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            العودة للتحليلات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-lg border-b border-blue-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/analysis')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">العودة للتحليلات</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Match Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img 
                src={analysis.tournament.logo} 
                alt={analysis.tournament.name}
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 className="text-xl font-bold text-white">{analysis.tournament.name}</h2>
                <p className="text-blue-200 text-sm">{formatDate(analysis.date)}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-bold">{analysis.views}</span>
              </div>
            </div>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex-1 text-center">
              <img 
                src={analysis.homeTeam.logo} 
                alt={analysis.homeTeam.name}
                className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 object-contain"
              />
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {analysis.homeTeam.name}
              </h3>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-2xl px-8 py-4">
                <p className="text-5xl md:text-6xl font-bold text-white">
                  {analysis.score.home} - {analysis.score.away}
                </p>
                <p className="text-blue-200 text-sm mt-2">النتيجة النهائية</p>
              </div>
            </div>

            <div className="flex-1 text-center">
              <img 
                src={analysis.awayTeam.logo} 
                alt={analysis.awayTeam.name}
                className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 object-contain"
              />
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {analysis.awayTeam.name}
              </h3>
            </div>
          </div>

          {analysis.venue && (
            <p className="text-center text-blue-200 mt-6">
              📍 {analysis.venue}
            </p>
          )}
        </motion.div>

        {/* AI Analysis Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🤖</span>
            <div>
              <h2 className="text-3xl font-bold text-white">تحليل المباراة بالذكاء الاصطناعي</h2>
              <p className="text-blue-200 text-sm">تحليل احترافي مدعوم بـ Groq AI</p>
            </div>
          </div>

          {/* Full Analysis */}
          <div className="prose prose-invert max-w-none">
            <div className="bg-blue-500/10 border-r-4 border-blue-500 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span>📊</span> ملخص المباراة
              </h3>
              <p className="text-blue-100 leading-relaxed whitespace-pre-line">
                {analysis.analysis.summary || analysis.analysis.fullText}
              </p>
            </div>

            {analysis.analysis.fullText && (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-lg">
                  <p className="text-white leading-relaxed text-lg whitespace-pre-line">
                    {analysis.analysis.fullText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
            <div className="flex gap-3">
              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold">
                ✨ AI Generated
              </span>
              <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-bold">
                Groq Powered
              </span>
            </div>

            <p className="text-gray-400 text-sm">
              تم التحليل: {new Date(analysis.createdAt).toLocaleString('ar-EG')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
