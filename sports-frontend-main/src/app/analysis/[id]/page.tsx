'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
      
      const url = `${API_URL}/api/analysis/${matchId}`;
      console.log('🔍 Fetching analysis:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `خطأ ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'التحليل غير موجود');
      }

      setAnalysis(data.data);
    } catch (err: any) {
      console.error('❌ Fetch error:', err);
      setError(err.message || 'حدث خطأ في تحميل التحليل');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!analysis) return;
    
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${analysis.homeTeam} vs ${analysis.awayTeam}`,
          text: analysis.analysis.summary,
          url: window.location.href,
        });
      } else {
        // Fallback: نسخ الرابط
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ الرابط ✅');
      }
    } catch (err) {
      console.log('Share cancelled or failed');
    } finally {
      setSharing(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // TODO: إرسال like للباك إند
  };

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 text-center border border-red-500/20"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">حدث خطأ</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => fetchAnalysis(params.id as string)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
            >
              رجوع
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ================= NO DATA STATE =================
  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <p className="text-gray-400 text-xl">لا توجد بيانات</p>
      </div>
    );
  }

  // ================= SUCCESS - RENDER ANALYSIS =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/10"
        >
          {/* Tournament Badge */}
          <div className="flex items-center gap-2 mb-4">
            {analysis.tournamentLogo && (
              <Image
                src={analysis.tournamentLogo}
                alt={analysis.tournament}
                width={24}
                height={24}
                className="rounded"
              />
            )}
            <span className="text-sm text-gray-300">{analysis.tournament}</span>
            {analysis.venue && (
              <span className="text-sm text-gray-400">• {analysis.venue}</span>
            )}
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex flex-col items-center flex-1">
              {analysis.homeTeamLogo && (
                <Image
                  src={analysis.homeTeamLogo}
                  alt={analysis.homeTeam}
                  width={80}
                  height={80}
                  className="mb-2"
                />
              )}
              <h2 className="text-xl font-bold text-center">{analysis.homeTeam}</h2>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 bg-black/30 px-6 py-3 rounded-xl">
              <span className="text-4xl font-bold">{analysis.scoreA}</span>
              <span className="text-2xl text-gray-500">-</span>
              <span className="text-4xl font-bold">{analysis.scoreB}</span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center flex-1">
              {analysis.awayTeamLogo && (
                <Image
                  src={analysis.awayTeamLogo}
                  alt={analysis.awayTeam}
                  width={80}
                  height={80}
                  className="mb-2"
                />
              )}
              <h2 className="text-xl font-bold text-center">{analysis.awayTeam}</h2>
            </div>
          </div>

          {/* Date & Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">
            <span>📅 {new Date(analysis.date).toLocaleDateString('ar-EG')}</span>
            <span>👁️ {analysis.views.toLocaleString('ar-EG')} مشاهدة</span>
          </div>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-6"
        >
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              liked
                ? 'bg-red-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {liked ? '❤️' : '🤍'} إعجاب {analysis.likes ? `(${analysis.likes})` : ''}
          </button>
          
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-all"
          >
            {sharing ? '⏳' : '🔗'} مشاركة
          </button>
        </motion.div>

        {/* Analysis Sections */}
        <div className="space-y-6">
          
          {/* Summary */}
          <AnalysisCard title="📊 ملخص المباراة" icon="📊">
            <p className="text-gray-300 leading-relaxed">
              {analysis.analysis.summary}
            </p>
          </AnalysisCard>

          {/* Full Text */}
          {analysis.analysis.fullText && (
            <AnalysisCard title="📝 التحليل الكامل" icon="📝">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {analysis.analysis.fullText}
              </p>
            </AnalysisCard>
          )}

          {/* Performance */}
          {analysis.analysis.performance && (
            <AnalysisCard title="⚡ الأداء" icon="⚡">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">الأداء العام</h4>
                  <p className="text-gray-300">{analysis.analysis.performance.overall}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">{analysis.homeTeam}</h4>
                    <p className="text-gray-300">{analysis.analysis.performance.homeTeam}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">{analysis.awayTeam}</h4>
                    <p className="text-gray-300">{analysis.analysis.performance.awayTeam}</p>
                  </div>
                </div>
              </div>
            </AnalysisCard>
          )}

          {/* Key Players */}
          {analysis.analysis.keyPlayers && (
            <AnalysisCard title="⭐ اللاعبون المميزون" icon="⭐">
              <p className="text-gray-300 leading-relaxed">
                {analysis.analysis.keyPlayers}
              </p>
            </AnalysisCard>
          )}

          {/* Tactics */}
          {analysis.analysis.tactics && (
            <AnalysisCard title="🎯 التكتيكات" icon="🎯">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">{analysis.homeTeam}</h4>
                    <p className="text-gray-300">{analysis.analysis.tactics.homeTeam}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">{analysis.awayTeam}</h4>
                    <p className="text-gray-300">{analysis.analysis.tactics.awayTeam}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-semibold text-green-400 mb-2">المقارنة</h4>
                  <p className="text-gray-300">{analysis.analysis.tactics.comparison}</p>
                </div>
              </div>
            </AnalysisCard>
          )}

          {/* Statistics */}
          {analysis.analysis.statistics && (
            <AnalysisCard title="📈 الإحصائيات" icon="📈">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {analysis.analysis.statistics}
              </p>
            </AnalysisCard>
          )}

          {/* Prediction */}
          {analysis.analysis.predictedWinner && (
            <AnalysisCard title="🔮 التوقعات" icon="🔮">
              <div className="text-center py-4">
                <p className="text-xl text-gray-300 mb-2">الفائز المتوقع</p>
                <p className="text-3xl font-bold text-green-400 mb-2">
                  {analysis.analysis.predictedWinner.team}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                      style={{
                        width: `${analysis.analysis.predictedWinner.probability}%`
                      }}
                    />
                  </div>
                  <span className="text-xl font-bold text-green-400">
                    {analysis.analysis.predictedWinner.probability}%
                  </span>
                </div>
              </div>
            </AnalysisCard>
          )}

        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          تم التحديث في {new Date(analysis.updatedAt || analysis.createdAt).toLocaleString('ar-EG')}
        </motion.div>

      </div>
    </div>
  );
}

// ================= REUSABLE CARD COMPONENT =================
function AnalysisCard({ 
  title, 
  icon, 
  children 
}: { 
  title: string; 
  icon: string; 
  children: React.ReactNode 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all"
    >
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
          }
