'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
    predictedWinner?: {
      team: string;
      probability: number;
    };
    performance?: {
      overall: string;
      homeTeam: string;
      awayTeam: string;
    };
  };
  views: number;
  likes?: number;
  createdAt: string;
  updatedAt?: string;
}

type FilterType = 'all' | 'recent' | 'popular' | 'today';
type ViewMode = 'grid' | 'list';

export default function AnalysisPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchAnalyses();
  }, [page]);

  useEffect(() => {
    applyFilters();
  }, [filter, analyses, searchQuery]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analysis?page=${page}&limit=20`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ API Response:', result);
      
      // Extract data from backend response
      if (result.success && result.data && Array.isArray(result.data)) {
        const newAnalyses = result.data;
        setAnalyses(prev => page === 1 ? newAnalyses : [...prev, ...newAnalyses]);
        setTotalCount(result.pagination?.total || result.data.length);
        setHasMore(result.pagination?.hasNext || false);
      } else {
        throw new Error('Invalid data format from server');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل التحليلات';
      setError(errorMessage);
      console.error('❌ Error fetching analyses:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...analyses];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.homeTeam?.toLowerCase().includes(query) ||
          a.awayTeam?.toLowerCase().includes(query) ||
          a.tournament?.toLowerCase().includes(query)
      );
    }

    // Sort filters
    switch (filter) {
      case 'recent':
        filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(
          a => new Date(a.createdAt).getTime() >= today.getTime()
        );
        break;
    }

    setFilteredAnalyses(filtered);
  }, [analyses, filter, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'منذ دقائق';
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white text-xl font-bold mb-2">جاري تحميل التحليلات...</p>
            <p className="text-blue-300 text-sm">مدعوم بالذكاء الاصطناعي Groq AI</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-50 shadow-2xl"
      >
        <div className="container mx-auto px-4 py-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 animate-pulse"></div>
                  <span className="relative text-5xl">🤖</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white">
                    تحليلات المباريات
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      AI Powered
                    </span>
                    <span className="text-blue-300 text-sm">
                      {totalCount} تحليل متاح
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="hidden md:flex bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="عرض شبكي"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="عرض قائمة"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 ابحث عن فريق أو بطولة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          >
            {[
              { id: 'recent', label: 'الأحدث', icon: '🕒' },
              { id: 'popular', label: 'الأكثر مشاهدة', icon: '🔥' },
              { id: 'today', label: 'اليوم', icon: '📅' },
              { id: 'all', label: 'الكل', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as FilterType)}
                className={`px-5 py-2.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500 backdrop-blur-lg rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">⚠️</span>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-1">حدث خطأ</p>
                  <p className="text-red-200">{error}</p>
                </div>
                <button
                  onClick={() => {
                    setPage(1);
                    fetchAnalyses();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                >
                  🔄 إعادة المحاولة
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && !error && filteredAnalyses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="text-8xl mb-6"
            >
              🤖
            </motion.div>
            <h3 className="text-3xl font-bold text-white mb-3">
              {searchQuery ? 'لا توجد نتائج' : 'لا توجد تحليلات حالياً'}
            </h3>
            <p className="text-blue-200 text-lg mb-6">
              {searchQuery 
                ? 'جرب البحث بكلمات مختلفة'
                : 'سيتم إضافة التحليلات تلقائياً بعد انتهاء المباريات'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
              >
                مسح البحث
              </button>
            )}
          </motion.div>
        )}

        {/* Analysis Cards */}
        {filteredAnalyses.length > 0 && (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredAnalyses.map((analysis, index) => (
                <motion.div
                  key={analysis._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/analysis/${analysis.matchId}`}>
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer group">
                      {/* Match Info */}
                      <div className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {analysis.tournamentLogo && (
                              <img
                                src={analysis.tournamentLogo}
                                alt={analysis.tournament}
                                className="w-10 h-10 object-contain rounded-lg"
                              />
                            )}
                            <div>
                              <p className="text-xs font-bold text-blue-200">{analysis.tournament}</p>
                              <p className="text-xs text-gray-400">{formatMatchDate(analysis.date)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1.5 rounded-full">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-bold text-yellow-300">{analysis.views || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Teams */}
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex-1 text-center">
                            {analysis.homeTeamLogo && (
                              <img
                                src={analysis.homeTeamLogo}
                                alt={analysis.homeTeam}
                                className="w-20 h-20 mx-auto mb-3 object-contain"
                              />
                            )}
                            <p className="text-white font-bold text-sm line-clamp-2 leading-tight">
                              {analysis.homeTeam}
                            </p>
                          </div>

                          <div className="text-center">
                            <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-lg rounded-2xl px-5 py-3 border border-white/30">
                              <p className="text-4xl font-black text-white">
                                {analysis.scoreA}
                                <span className="text-gray-400 mx-2">-</span>
                                {analysis.scoreB}
                              </p>
                              <p className="text-xs text-blue-200 mt-1 font-semibold">النهائي</p>
                            </div>
                          </div>

                          <div className="flex-1 text-center">
                            {analysis.awayTeamLogo && (
                              <img
                                src={analysis.awayTeamLogo}
                                alt={analysis.awayTeam}
                                className="w-20 h-20 mx-auto mb-3 object-contain"
                              />
                            )}
                            <p className="text-white font-bold text-sm line-clamp-2 leading-tight">
                              {analysis.awayTeam}
                            </p>
                          </div>
                        </div>

                        {analysis.venue && (
                          <p className="text-center text-blue-200 text-xs mt-3 flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {analysis.venue}
                          </p>
                        )}
                      </div>

                      {/* Analysis Preview */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-green-500 blur-lg opacity-50 animate-pulse"></div>
                            <span className="relative text-3xl">🤖</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">تحليل ذكي</h3>
                            <p className="text-xs text-green-400 font-semibold">AI Analysis</p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                          <p className="text-blue-100 text-sm leading-relaxed line-clamp-3">
                            {analysis.analysis.summary || analysis.analysis.fullText?.substring(0, 150) + '...'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-400 text-sm font-bold group-hover:text-blue-300 transition-colors">
                            <span>اقرأ المزيد</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-[-4px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l-5 5 5 5" />
                            </svg>
                          </div>

                          <div className="flex gap-2">
                            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              ✨ AI
                            </span>
                            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              جديد
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {formatDate(analysis.createdAt)}
                          </span>
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full font-bold">
                            Groq AI
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-12"
              >
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-blue-500/50"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التحميل...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      تحميل المزيد
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  )}
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
  }
