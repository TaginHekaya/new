'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analysis/${matchId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }
      );
      
      if (!response.ok) {
        throw new Error(`Analysis not found (${response.status})`);
      }
      
      const result = await response.json();
      console.log('✅ API Response:', result);
      
      // Extract data from backend response
      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل التحليل';
      setError(errorMessage);
      console.error('❌ Error:', err);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    setSharing(true);
    const shareData = {
      title: `تحليل مباراة ${analysis?.homeTeam} vs ${analysis?.awayTeam}`,
      text: analysis?.analysis.summary,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ الرابط!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    } finally {
      setSharing(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // يمكنك إضافة API call هنا لحفظ الإعجاب
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl">🤖</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white text-xl font-bold mb-2">جاري تحميل التحليل...</p>
            <p className="text-blue-300 text-sm">تحليل احترافي بالذكاء الاصطناعي</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md"
        >
          <div className="text-8xl mb-6">😔</div>
          <h2 className="text-3xl font-bold text-white mb-3">عذراً!</h2>
          <p className="text-red-400 text-xl mb-2">❌ {error}</p>
          <p className="text-gray-400 mb-6">Match ID: {params.id}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => fetchAnalysis(params.id as string)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              إعادة المحاولة
            </button>
            <button
              onClick={() => router.push('/analysis')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sticky Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-slate-900/90 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-50 shadow-2xl"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/analysis')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-all hover:scale-105 bg-white/10 px-4 py-2 rounded-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-bold hidden sm:inline">العودة للتحليلات</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Share Button */}
              <button
                onClick={handleShare}
                disabled={sharing}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all hover:scale-105"
                title="مشاركة"
              >
                {sharing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
              </button>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`p-3 rounded-xl transition-all hover:scale-105 ${
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="إعجاب"
              >
                <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Match Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-8 mb-8 border-2 border-white/20 shadow-2xl"
        >
          {/* Tournament Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {analysis.tournamentLogo && (
                <img
                  src={analysis.tournamentLogo}
                  alt={analysis.tournament}
                  className="w-16 h-16 object-contain rounded-xl bg-white/10 p-2"
                />
              )}
              <div>
                <h2 className="text-2xl font-black text-white">{analysis.tournament}</h2>
                <p className="text-blue-200 text-sm flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {formatDate(analysis.date)}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-5 py-2 rounded-full border border-yellow-500/30">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-black text-lg">{analysis.views || 0}</span>
              </div>
              {analysis.likes && analysis.likes > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm px-5 py-2 rounded-full border border-red-500/30">
                  <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-black text-lg">{analysis.likes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Teams Display */}
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Home Team */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 text-center"
            >
              {analysis.homeTeamLogo && (
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 animate-pulse"></div>
                  <img
                    src={analysis.homeTeamLogo}
                    alt={analysis.homeTeam}
                    className="relative w-32 h-32 md:w-40 md:h-40 object-contain"
                  />
                </div>
              )}
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                {analysis.homeTeam}
              </h3>
              <span className="text-blue-300 text-sm font-semibold">الفريق المضيف</span>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-3xl px-10 py-6 border-2 border-white/40 shadow-2xl">
                <p className="text-6xl md:text-7xl font-black text-white mb-2">
                  <span className={analysis.scoreA > analysis.scoreB ? 'text-green-400' : ''}>{analysis.scoreA}</span>
                  <span className="text-gray-300 mx-3">-</span>
                  <span className={analysis.scoreB > analysis.scoreA ? 'text-green-400' : ''}>{analysis.scoreB}</span>
                </p>
                <div className="bg-green-500/20 border border-green-500/50 rounded-full px-4 py-2 inline-block">
                  <p className="text-green-300 text-sm font-bold">النتيجة النهائية</p>
                </div>
              </div>
            </motion.div>

            {/* Away Team */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 text-center"
            >
              {analysis.awayTeamLogo && (
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-30 animate-pulse"></div>
                  <img
                    src={analysis.awayTeamLogo}
                    alt={analysis.awayTeam}
                    className="relative w-32 h-32 md:w-40 md:h-40 object-contain"
                  />
                </div>
              )}
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                {analysis.awayTeam}
              </h3>
              <span className="text-purple-300 text-sm font-semibold">الفريق الضيف</span>
            </motion.div>
          </div>

          {/* Venue */}
          {analysis.venue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-semibold">{analysis.venue}</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* AI Analysis Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/20">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 blur-2xl opacity-50 animate-pulse"></div>
              <span className="relative text-6xl">🤖</span>
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-2">تحليل المباراة</h2>
              <div className="flex items-center gap-3">
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                  ✨ AI Powered
                </span>
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Groq Technology
                </span>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-r-4 border-blue-500 p-6 rounded-2xl mb-6">
            <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
              <span>📊</span> ملخص المباراة
            </h3>
            <p className="text-blue-100 text-lg leading-relaxed whitespace-pre-line">
              {analysis.analysis.summary}
            </p>
          </div>

          {/* Full Analysis */}
          {analysis.analysis.fullText && (
            <div className="space-y-6 mb-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <span>🔍</span> التحليل التفصيلي
                </h3>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-white leading-relaxed text-lg whitespace-pre-line">
                    {analysis.analysis.fullText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Performance Section */}
          {analysis.analysis.performance && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl">
                <h4 className="text-xl font-black text-blue-400 mb-3 flex items-center gap-2">
                  <span>🏠</span> أداء {analysis.homeTeam}
                </h4>
                <p className="text-white leading-relaxed">{analysis.analysis.performance.homeTeam}</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-2xl">
                <h4 className="text-xl font-black text-purple-400 mb-3 flex items-center gap-2">
                  <span>✈️</span> أداء {analysis.awayTeam}
                </h4>
                <p className="text-white leading-relaxed">{analysis.analysis.performance.awayTeam}</p>
              </div>
            </div>
          )}

          {/* Key Players */}
          {analysis.analysis.keyPlayers && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-2xl mb-6">
              <h3 className="text-2xl font-black text-yellow-400 mb-4 flex items-center gap-3">
                <span>⭐</span> اللاعبون الأبرز
              </h3>
              <p className="text-white leading-relaxed text-lg">{analysis.analysis.keyPlayers}</p>
            </div>
          )}

          {/* Tactics */}
          {analysis.analysis.tactics && (
            <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl mb-6">
              <h3 className="text-2xl font-black text-green-400 mb-4 flex items-center gap-3">
                <span>⚔️</span> التكتيكات
              </h3>
              <p className="text-white leading-relaxed text-lg mb-4">{analysis.analysis.tactics.comparison}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-blue-300 mb-2">{analysis.homeTeam}</h4>
                  <p className="text-gray-300">{analysis.analysis.tactics.homeTeam}</p>
                </div>
                <div>
                  <h4 className="font-bold text-purple-300 mb-2">{analysis.awayTeam}</h4>
                  <p className="text-gray-300">{analysis.analysis.tactics.awayTeam}</p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          {analysis.analysis.statistics && (
            <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-2xl mb-6">
              <h3 className="text-2xl font-black text-orange-400 mb-4 flex items-center gap-3">
                <span>📈</span> الإحصائيات
              </h3>
              <p className="text-white leading-relaxed text-lg">{analysis.analysis.statistics}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-full text-sm font-black shadow-lg">
                ✨ AI Generated
              </span>
              <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-5 py-2 rounded-full text-sm font-black shadow-lg">
                Groq Powered
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-5 py-2 rounded-full text-sm font-black shadow-lg">
                Professional Analysis
              </span>
            </div>

            <div className="text-gray-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>تم التحليل: {new Date(analysis.createdAt).toLocaleString('ar-EG')}</span>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={() => router.push('/analysis')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-2xl shadow-blue-500/50 inline-flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            العودة إلى جميع التحليلات
          </button>
        </motion.div>
      </div>
    </div>
  );
      }
