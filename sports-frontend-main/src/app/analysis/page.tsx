'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, Filter, Grid, List, TrendingUp, Clock, Calendar,
  Eye, Heart, Share2, Bookmark, ChevronDown, Star,
  Award, Users, Target, Zap, BarChart3, Download,
  Play, ArrowUpRight, Sparkles
} from 'lucide-react';

interface Analysis {
  _id: string;
  matchId: string;
  homeTeam: { id: number; name: string; logo: string; };
  awayTeam: { id: number; name: string; logo: string; };
  score: { home: number; away: number; };
  tournament: { id: number; name: string; logo: string; };
  venue?: string;
  date: string;
  analysis: { summary: string; fullText?: string; };
  views: number;
  likes?: number;
  createdAt: string;
}

type FilterType = 'all' | 'recent' | 'popular' | 'today' | 'week' | 'trending';
type ViewMode = 'grid' | 'list' | 'compact';
type SortType = 'date' | 'views' | 'likes' | 'relevance';

export default function AnalysisPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [savedAnalyses, setSavedAnalyses] = useState<Set<string>>(new Set());
  const [likedAnalyses, setLikedAnalyses] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<string>('all');
  const [tournaments, setTournaments] = useState<string[]>([]);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);

  // Statistics
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalViews: 0,
    todayAnalyses: 0,
    trendingCount: 0
  });

  useEffect(() => {
    fetchAnalyses();
    loadSavedPreferences();
  }, [page]);

  useEffect(() => {
    applyFilters();
    updateStats();
  }, [filter, analyses, searchQuery, sortBy, selectedTournament]);

  useEffect(() => {
    setupInfiniteScroll();
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    const uniqueTournaments = [...new Set(analyses.map(a => a.tournament.name))];
    setTournaments(uniqueTournaments);
  }, [analyses]);

  const setupInfiniteScroll = () => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(p => p + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  };

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analysis?page=${page}&limit=20`,
        { cache: 'no-store' }
      );

      const result = await response.json();

      if (result.success && result.data) {
        const newAnalyses = result.data;
        setAnalyses(prev => page === 1 ? newAnalyses : [...prev, ...newAnalyses]);
        setTotalCount(result.total || newAnalyses.length);
        setHasMore(result.pages > page);
      } else {
        throw new Error('Invalid data from server');
      }
    } catch (err: any) {
      setError(err.message || 'فشل تحميل التحليلات');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...analyses];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.homeTeam.name.toLowerCase().includes(q) ||
          a.awayTeam.name.toLowerCase().includes(q) ||
          a.tournament.name.toLowerCase().includes(q)
      );
    }

    // Tournament filter
    if (selectedTournament !== 'all') {
      filtered = filtered.filter(a => a.tournament.name === selectedTournament);
    }

    // Time-based filters
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'today':
        filtered = filtered.filter(a => new Date(a.createdAt) >= today);
        break;
      case 'week':
        filtered = filtered.filter(a => new Date(a.createdAt) >= weekAgo);
        break;
      case 'trending':
        filtered = filtered.filter(a => (a.views || 0) > 100);
        break;
      case 'popular':
        filtered = filtered.filter(a => (a.views || 0) > 50);
        break;
    }

    // Sorting
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'views':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'likes':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
    }

    setFilteredAnalyses(filtered);
  }, [analyses, searchQuery, filter, sortBy, selectedTournament]);

  const updateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setStats({
      totalAnalyses: analyses.length,
      totalViews: analyses.reduce((sum, a) => sum + (a.views || 0), 0),
      todayAnalyses: analyses.filter(a => new Date(a.createdAt) >= today).length,
      trendingCount: analyses.filter(a => (a.views || 0) > 100).length
    });
  };

  const loadSavedPreferences = () => {
    const saved = localStorage.getItem('savedAnalyses');
    const liked = localStorage.getItem('likedAnalyses');
    if (saved) setSavedAnalyses(new Set(JSON.parse(saved)));
    if (liked) setLikedAnalyses(new Set(JSON.parse(liked)));
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedAnalyses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      localStorage.setItem('savedAnalyses', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedAnalyses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      localStorage.setItem('likedAnalyses', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatMatchDate = (d: string) =>
    new Date(d).toLocaleString('ar-EG', { month: 'short', day: 'numeric' });

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = {
      سنة: 31536000,
      شهر: 2592000,
      أسبوع: 604800,
      يوم: 86400,
      ساعة: 3600,
      دقيقة: 60
    };

    for (const [name, secondsInInterval] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInInterval);
      if (interval >= 1) {
        return `منذ ${interval} ${name}`;
      }
    }
    return 'الآن';
  };

  const SkeletonCard = () => (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-full"></div>
        <div className="w-20 h-4 bg-white/10 rounded"></div>
      </div>
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="w-24 h-10 bg-white/10 rounded"></div>
        <div className="w-16 h-16 bg-white/10 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-4 bg-white/10 rounded"></div>
        <div className="w-3/4 h-4 bg-white/10 rounded mx-auto"></div>
      </div>
    </div>
  );

  const FilterButton = ({ active, onClick, icon: Icon, label, count }: any) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {count !== undefined && (
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{count}</span>
      )}
    </motion.button>
  );

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto p-4 md:p-6 relative z-10">
        
        {/* Hero Header */}
        <motion.div 
          style={{ opacity: headerOpacity, scale: headerScale }}
          className="mb-8 text-center sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              تحليلات احترافية عالمية
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>

          {/* Live Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: BarChart3, label: 'إجمالي التحليلات', value: stats.totalAnalyses, color: 'blue' },
              { icon: Eye, label: 'المشاهدات', value: stats.totalViews.toLocaleString(), color: 'purple' },
              { icon: Calendar, label: 'تحليلات اليوم', value: stats.todayAnalyses, color: 'green' },
              { icon: TrendingUp, label: 'الأكثر رواجاً', value: stats.trendingCount, color: 'pink' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 backdrop-blur-sm p-4 rounded-xl border border-${stat.color}-500/20`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-400 mx-auto mb-2`} />
                <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن الفريق، البطولة..."
              className="w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center text-red-400"
              >
                ×
              </motion.button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <FilterButton
              active={filter === 'recent'}
              onClick={() => setFilter('recent')}
              icon={Clock}
              label="الأحدث"
            />
            <FilterButton
              active={filter === 'popular'}
              onClick={() => setFilter('popular')}
              icon={TrendingUp}
              label="الأكثر مشاهدة"
            />
            <FilterButton
              active={filter === 'today'}
              onClick={() => setFilter('today')}
              icon={Calendar}
              label="اليوم"
              count={stats.todayAnalyses}
            />
            <FilterButton
              active={filter === 'week'}
              onClick={() => setFilter('week')}
              icon={Target}
              label="هذا الأسبوع"
            />
            <FilterButton
              active={filter === 'trending'}
              onClick={() => setFilter('trending')}
              icon={Zap}
              label="الأكثر رواجاً"
              count={stats.trendingCount}
            />
          </div>

          {/* View Mode & Sort Controls */}
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              {[
                { mode: 'grid' as ViewMode, icon: Grid },
                { mode: 'list' as ViewMode, icon: List },
                { mode: 'compact' as ViewMode, icon: BarChart3 }
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="date">الأحدث</option>
              <option value="views">الأكثر مشاهدة</option>
              <option value="likes">الأكثر إعجاباً</option>
            </select>

            {tournaments.length > 0 && (
              <select
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">كل البطولات</option>
                {tournaments.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
          </div>

          {/* Results Count */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-gray-400 text-sm"
          >
            عرض {filteredAnalyses.length} من أصل {totalCount} تحليل
          </motion.div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Empty State */}
        {filteredAnalyses.length === 0 && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج</h3>
            <p className="text-gray-400 mb-6">جرب تغيير معايير البحث أو الفلترة</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('recent');
                setSelectedTournament('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              إعادة تعيين الفلاتر
            </button>
          </motion.div>
        )}

        {/* Analysis Cards */}
        <AnimatePresence mode="popLayout">
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : viewMode === 'list'
              ? 'space-y-4'
              : 'grid grid-cols-1 md:grid-cols-2 gap-4'
          }>
            {filteredAnalyses.map((a, index) => (
              <motion.div
                key={a._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/analysis/${a.matchId}`}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    {/* Trending Badge */}
                    {(a.views || 0) > 100 && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10">
                        <Zap className="w-3 h-3" />
                        رائج
                      </div>
                    )}

                    {/* Tournament Header */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.img
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        src={a.tournament.logo}
                        alt={a.tournament.name}
                        className="w-12 h-12 object-contain drop-shadow-lg"
                      />
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400">{formatMatchDate(a.date)}</span>
                        <span className="text-xs text-blue-400 font-semibold">{getTimeAgo(a.createdAt)}</span>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="text-center"
                      >
                        <img
                          src={a.homeTeam.logo}
                          alt={a.homeTeam.name}
                          className="w-16 h-16 mx-auto mb-2 drop-shadow-xl"
                        />
                        <p className="text-sm font-semibold text-white">{a.homeTeam.name}</p>
                      </motion.div>

                      <div className="text-center">
                        <motion.h2
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                        >
                          {a.score.home} - {a.score.away}
                        </motion.h2>
                        <div className="text-xs text-gray-500 mt-1">نتيجة نهائية</div>
                      </div>

                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="text-center"
                      >
                        <img
                          src={a.awayTeam.logo}
                          alt={a.awayTeam.name}
                          className="w-16 h-16 mx-auto mb-2 drop-shadow-xl"
                        />
                        <p className="text-sm font-semibold text-white">{a.awayTeam.name}</p>
                      </motion.div>
                    </div>

                    {/* Tournament Name */}
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-300 font-medium bg-white/5 inline-block px-4 py-1 rounded-full">
                        {a.tournament.name}
                      </p>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center gap-1 text-gray-400"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-semibold">{(a.views || 0).toLocaleString()}</span>
                        </motion.div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleLike(a._id, e)}
                          className="flex items-center gap-1"
                        >
                          <Heart 
                            className={`w-4 h-4 ${likedAnalyses.has(a._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                          />
                          <span className="text-sm font-semibold text-gray-400">{a.likes || 0}</span>
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleSave(a._id, e)}
                          className={`p-2 rounded-lg transition-all ${
                            savedAnalyses.has(a._id)
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${savedAnalyses.has(a._id) ? 'fill-current' : ''}`} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl flex items-end justify-center pb-6 pointer-events-none"
                    >
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <span>عرض التحليل الكامل</span>
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Infinite Scroll Trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="py-8 text-center">
            {loading && (
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                />
                <span>جاري التحميل...</span>
              </div>
            )}
          </div>
        )}

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {scrollY.get() > 500 && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 left-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl shadow-blue-500/30 z-50"
            >
              <ChevronDown className="w-6 h-6 rotate-180" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
