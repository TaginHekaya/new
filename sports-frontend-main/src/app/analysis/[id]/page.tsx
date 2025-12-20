'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Share2, Bookmark, Heart, Eye, Calendar, MapPin,
  TrendingUp, Award, Users, Zap, Target, Activity, BarChart3,
  Clock, Download, Printer, ChevronDown, ChevronUp, Play,
  Star, MessageCircle, ThumbsUp, ExternalLink, Sparkles,
  Trophy, Shield, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

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
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    if (params.id) fetchAnalysis(params.id as string);
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setReadingProgress(Math.min(progress, 100));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchAnalysis = async (matchId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/analysis/${matchId}`, { cache: 'no-store' });
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.message || 'فشل تحميل التحليل');

      setAnalysis(json.data);
      setLikeCount(json.data.likes || 0);
      setViewCount(json.data.views || 0);

      // Check saved/liked from localStorage
      const savedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
      const likedAnalyses = JSON.parse(localStorage.getItem('likedAnalyses') || '[]');
      setSaved(savedAnalyses.includes(matchId));
      setLiked(likedAnalyses.includes(matchId));

    } catch (err: any) {
      setError(err.message || 'خطأ أثناء تحميل التحليل');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

    const likedAnalyses = JSON.parse(localStorage.getItem('likedAnalyses') || '[]');
    if (newLiked) {
      likedAnalyses.push(params.id);
    } else {
      const index = likedAnalyses.indexOf(params.id);
      if (index > -1) likedAnalyses.splice(index, 1);
    }
    localStorage.setItem('likedAnalyses', JSON.stringify(likedAnalyses));
  };

  const toggleSave = () => {
    const newSaved = !saved;
    setSaved(newSaved);

    const savedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
    if (newSaved) {
      savedAnalyses.push(params.id);
    } else {
      const index = savedAnalyses.indexOf(params.id);
      if (index > -1) savedAnalyses.splice(index, 1);
    }
    localStorage.setItem('savedAnalyses', JSON.stringify(savedAnalyses));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const shareAnalysis = async (platform: string) => {
    const url = window.location.href;
    const text = `تحليل مباراة: ${analysis?.homeTeam.name} vs ${analysis?.awayTeam.name}`;

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('تم نسخ الرابط!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }

    setShowShareMenu(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

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
      if (interval >= 1) return `منذ ${interval} ${name}`;
    }
    return 'الآن';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">جاري تحميل التحليل...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">خطأ في التحميل</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/analysis')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold"
          >
            العودة للتحليلات
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const data = analysis.analysis;
  const sections = [
    { id: 'summary', icon: BarChart3, title: 'ملخص التحليل', content: data.fullText || data.summary, data: undefined },
    { id: 'performance', icon: Activity, title: 'تحليل الأداء', content: undefined, data: data.performance },
    { id: 'keyPlayers', icon: Star, title: 'اللاعبون المؤثرون', content: data.keyPlayers, data: undefined },
    { id: 'tactics', icon: Target, title: 'التكتيكات', content: undefined, data: data.tactics },
    { id: 'statistics', icon: TrendingUp, title: 'الإحصائيات', content: data.statistics, data: undefined },
    { id: 'strengths', icon: Trophy, title: 'نقاط القوة والضعف', content: undefined, data: { strengths: data.strengths, weaknesses: data.weaknesses } }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
      />

      {/* Back Button & Actions Header */}
      <motion.div
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/analysis')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline">العودة</span>
            </motion.button>

            <div className="flex items-center gap-3">
              {/* Views */}
              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="w-5 h-5" />
                <span className="text-sm font-semibold">{viewCount.toLocaleString()}</span>
              </div>

              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLike}
                className={`p-3 rounded-xl transition-all ${
                  liked
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </motion.button>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSave}
                className={`p-3 rounded-xl transition-all ${
                  saved
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              </motion.button>

              {/* Share Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="absolute left-0 mt-2 p-3 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl w-48"
                    >
                      {['twitter', 'facebook', 'whatsapp', 'telegram', 'copy'].map((platform) => (
                        <button
                          key={platform}
                          onClick={() => shareAnalysis(platform)}
                          className="w-full text-right px-3 py-2 hover:bg-white/10 rounded-lg text-white text-sm transition-all"
                        >
                          {platform === 'copy' ? '📋 نسخ الرابط' :
                           platform === 'twitter' ? '🐦 تويتر' :
                           platform === 'facebook' ? '📘 فيسبوك' :
                           platform === 'whatsapp' ? '💬 واتساب' :
                           '✈️ تيليجرام'}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Download PDF */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-all hidden md:block"
                title="تحميل PDF"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 relative z-10" ref={contentRef}>
        
        {/* Match Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* Tournament Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <img
                src={analysis.tournament.logo}
                alt={analysis.tournament.name}
                className="w-12 h-12 object-contain drop-shadow-lg"
              />
              <div className="text-center">
                <h2 className="text-lg font-bold text-white">{analysis.tournament.name}</h2>
                <p className="text-sm text-gray-400">{formatDate(analysis.date)}</p>
              </div>
            </motion.div>

            {/* Teams & Score */}
            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Home Team */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center flex-1 max-w-xs"
              >
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src={analysis.homeTeam.logo}
                  alt={analysis.homeTeam.name}
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 drop-shadow-2xl"
                />
                <h3 className="text-xl md:text-2xl font-bold text-white">{analysis.homeTeam.name}</h3>
                <p className="text-sm text-gray-400 mt-1">الفريق المضيف</p>
              </motion.div>

              {/* Score */}
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ delay: 0.4, type: "spring" }}
  className="text-center flex-1"
>
  <div className="w-full flex items-center justify-center">
    <div className="flex items-center justify-center gap-6 text-5xl md:text-6xl font-extrabold gradient-text-animated tracking-wide">
      <span className="block w-16 text-center">{analysis.score.home}</span>
      <span className="block w-10 text-center">-</span>
      <span className="block w-16 text-center">{analysis.score.away}</span>
    </div>
  </div>
  <p className="text-xs text-gray-400 mt-2 text-center">النتيجة النهائية</p>
</motion.div>

{/* Away Team */}
<motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ delay: 0.3 }}
  className="text-center flex-1 max-w-xs"
>
  <motion.img
    whileHover={{ scale: 1.1, rotate: -5 }}
    src={analysis.awayTeam.logo}
    alt={analysis.awayTeam.name}
    className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 drop-shadow-2xl"
  />
  <h3 className="text-xl md:text-2xl font-bold text-white">{analysis.awayTeam.name}</h3>
  <p className="text-sm text-gray-400 mt-1">الفريق الضيف</p>
</motion.div>
              
            {/* Match Info */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-white/10">
              {analysis.venue && (
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{analysis.venue}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{getTimeAgo(analysis.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2 text-green-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">تحليل حصري</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm p-4 rounded-xl border border-blue-500/20 text-center">
            <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{viewCount.toLocaleString()}</div>
            <div className="text-xs text-gray-400">مشاهدة</div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm p-4 rounded-xl border border-red-500/20 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-400">{likeCount}</div>
            <div className="text-xs text-gray-400">إعجاب</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm p-4 rounded-xl border border-yellow-500/20 text-center">
            <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">⭐</div>
            <div className="text-xs text-gray-400">تحليل مميز</div>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10"
        >
          <button
            onClick={() => setShowTableOfContents(!showTableOfContents)}
            className="flex items-center justify-between w-full text-white"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">محتويات التحليل</h3>
            </div>
            {showTableOfContents ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <AnimatePresence>
            {showTableOfContents && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-2 overflow-hidden"
              >
                {sections.filter(s => s.content || (s.data && Object.keys(s.data).length > 0)).map((section, i) => (
                  <motion.a
                    key={section.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                  >
                    <section.icon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-white">{section.title}</span>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Analysis Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const hasContent = section.content || (section.data && Object.keys(section.data).length > 0);
            if (!hasContent) return null;

            const isExpanded = expandedSections.has(section.id);
            const Icon = section.icon;

            return (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  </motion.div>
                </button>

                {/* Section Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-200">
                        {/* Summary Section */}
                        {section.id === 'summary' && section.content && (
                          <div className="prose prose-invert max-w-none">
                            <p className="text-lg leading-relaxed whitespace-pre-line">
                              {section.content.replace(/\*\*/g, '')}
                            </p>
                          </div>
                        )}

                        {/* Performance Section */}
                        {section.id === 'performance' && section.data && (
                          <div className="space-y-4">
                            {(section.data as any).homeTeam && (
                              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Shield className="w-5 h-5 text-blue-400" />
                                  <h4 className="font-bold text-blue-400">أداء الفريق المضيف</h4>
                                </div>
                                <p className="text-gray-300">{(section.data as any).homeTeam}</p>
                              </div>
                            )}

                            {(section.data as any).awayTeam && (
                              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Shield className="w-5 h-5 text-purple-400" />
                                  <h4 className="font-bold text-purple-400">أداء الفريق الضيف</h4>
                                </div>
                                <p className="text-gray-300">{(section.data as any).awayTeam}</p>
                              </div>
                            )}

                            {(section.data as any).overall && (
                              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Activity className="w-5 h-5 text-green-400" />
                                  <h4 className="font-bold text-green-400">التقييم العام</h4>
                                </div>
                                <p className="text-gray-300">{(section.data as any).overall}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Key Players */}
                        {section.id === 'keyPlayers' && section.content && (
                          <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                              {section.content}
                            </p>
                          </div>
                        )}

                        {/* Tactics */}
                        {section.id === 'tactics' && section.data && (
                          <div className="space-y-4">
                            {(section.data as any).homeTeam && (
                              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Target className="w-5 h-5 text-blue-400" />
                                  <h4 className="font-bold text-blue-400">تكتيك الفريق المضيف</h4>
                                </div>
                                <p className="text-gray-300">{(section.data as any).homeTeam}</p>
                              </div>
                            )}

                            {(section.data as any).awayTeam && (
                              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Target className="w-5 h-5 text-purple-400" />
                                  <h4 className="font-bold text-purple-400">تكتيك الفريق الضيف</h4>
                                </div>
                                <p className="text-gray-300">{(section.data as any).awayTeam}</p>
                              </div>
                            )}

                            {(section.data as any).comparison && (
                              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <BarChart3 className="w-5 h-5 text-white" />
                                  <h4 className="font-bold text-white">المقارنة التكتيكية</h4>
                                </div>
                                <p className="text-gray-300">{(section.data as any).comparison}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Statistics */}
                        {section.id === 'statistics' && section.content && (
                          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/20">
                            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                              {section.content}
                            </p>
                          </div>
                        )}

                        {/* Strengths & Weaknesses */}
                        {section.id === 'strengths' && section.data && (
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Strengths */}
                            {(section.data as any).strengths && (
                              <div className="space-y-3">
                                <h4 className="font-bold text-green-400 text-xl mb-3 flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5" />
                                  نقاط القوة
                                </h4>

                                {(section.data as any).strengths.homeTeam && (
                                  <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                    <p className="font-semibold text-white mb-2">الفريق المضيف:</p>
                                    <ul className="space-y-1">
                                      {(section.data as any).strengths.homeTeam.map((strength: string, i: number) => (
                                        <li key={i} className="text-gray-300 flex items-start gap-2">
                                          <span className="text-green-400 mt-1">✓</span>
                                          <span>{strength}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {(section.data as any).strengths.awayTeam && (
                                  <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                    <p className="font-semibold text-white mb-2">الفريق الضيف:</p>
                                    <ul className="space-y-1">
                                      {(section.data as any).strengths.awayTeam.map((strength: string, i: number) => (
                                        <li key={i} className="text-gray-300 flex items-start gap-2">
                                          <span className="text-green-400 mt-1">✓</span>
                                          <span>{strength}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Weaknesses */}
                            {(section.data as any).weaknesses && (
                              <div className="space-y-3">
                                <h4 className="font-bold text-red-400 text-xl mb-3 flex items-center gap-2">
                                  <XCircle className="w-5 h-5" />
                                  نقاط الضعف
                                </h4>

                                {(section.data as any).weaknesses.homeTeam && (
                                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                    <p className="font-semibold text-white mb-2">الفريق المضيف:</p>
                                    <ul className="space-y-1">
                                      {(section.data as any).weaknesses.homeTeam.map((weakness: string, i: number) => (
                                        <li key={i} className="text-gray-300 flex items-start gap-2">
                                          <span className="text-red-400 mt-1">✗</span>
                                          <span>{weakness}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {(section.data as any).weaknesses.awayTeam && (
                                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                    <p className="font-semibold text-white mb-2">الفريق الضيف:</p>
                                    <ul className="space-y-1">
                                      {(section.data as any).weaknesses.awayTeam.map((weakness: string, i: number) => (
                                        <li key={i} className="text-gray-300 flex items-start gap-2">
                                          <span className="text-red-400 mt-1">✗</span>
                                          <span>{weakness}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-12 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center"
        >
          <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">هل أعجبك التحليل؟</h3>
          <p className="text-gray-300 mb-6">شاركه مع أصدقائك وساعدنا في نشر المحتوى الاحترافي!</p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLike}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <Heart className={liked ? 'fill-current' : ''} />
              {liked ? 'تم الإعجاب' : 'أعجبني'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareMenu(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <Share2 />
              مشاركة
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/analysis')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold border border-white/20"
            >
              تحليلات أخرى
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {readingProgress > 20 && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 left-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl shadow-blue-500/30 z-50"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
