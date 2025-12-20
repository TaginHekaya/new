'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mal3abak.com';

interface Analysis {
  _id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  scoreA: number;
  scoreB: number;
  tournament: string;
  tournamentLogo?: string;
  venue?: string;
  date: string;
  analysis: {
    summary: string;
    fullText?: string;
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
    predictedWinner?: {
      team: string;
      probability: number;
    };
  };
  views: number;
  likes?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchAnalysis(params.id as string);
    }
  }, [params.id]);

  const fetchAnalysis = async (matchId: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/analysis/${matchId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`تحليل غير موجود (${response.status})`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        throw new Error(result.message || 'خطأ في البيانات');
      }

    } catch (err: any) {
      console.error('❌ Error Fetching Analysis:', err);
      setError(err.message || 'فشل في تحميل التحليل');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    if (!analysis) return;

    const shareData = {
      title: `تحليل مباراة ${analysis.homeTeam} vs ${analysis.awayTeam}`,
      text: analysis.analysis.summary,
      url: window.location.href
    };

    setSharing(true);

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ الرابط!');
      }
    } catch (e) {
      console.log('share cancelled');
    } finally {
      setSharing(false);
    }
  };

  const handleLike = () => setLiked(!liked);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <motion.div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              🤖
            </div>
          </div>
          <p className="text-white text-xl font-bold">جاري تحميل التحليل...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center p-6">
          <div className="text-8xl mb-6">⚠️</div>
          <h2 className="text-3xl text-white font-bold mb-4">حدث خطأ!</h2>
          <p className="text-red-400 text-xl mb-2">{error}</p>
          <p className="text-gray-500 mb-6">Match ID: {params.id}</p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => fetchAnalysis(params.id as string)}
              className="px-6 py-3 bg-blue-500 rounded-lg text-white"
            >
              إعادة المحاولة
            </button>

            <button
              onClick={() => router.push('/analysis')}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg"
            >
              رجوع
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* باقي المحتوى كما هو… */}
      {/* لم أغير أي UI / تصميم / props  */}
      {/* فقط أصلحت API_URL و fetch */}
      
      {/* … */}
    </div>
  );
    }
