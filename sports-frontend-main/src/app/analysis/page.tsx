'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Analysis {
  _id: string;
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
    name: string;
    country: string;
    logo: string;
  };
  date: string;
  analysis: {
    summary: string;
    fullText?: string;
  };
  views: number;
  createdAt: string;
}

export default function AnalysisPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'recent' | 'popular'>('recent');

  useEffect(() => {
    fetchAnalyses();
  }, [filter]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analysis`);
      
      if (!response.ok) throw new Error('Failed to fetch analyses');
      
      let data = await response.json();
      
      // Apply filters
      if (filter === 'recent') {
        data = data.sort((a: Analysis, b: Analysis) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (filter === 'popular') {
        data = data.sort((a: Analysis, b: Analysis) => b.views - a.views);
      }
      
      setAnalyses(data);
    } catch (err) {
      setError('فشل في تحميل التحليلات');
      console.error('Error fetching analyses:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
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
          <p className="text-white text-lg">جاري تحميل التحليلات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-lg border-b border-blue-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                🤖 تحليلات المباريات
              </h1>
              <p className="text-blue-200 text-sm md:text-base">
                تحليلات احترافية بالذكاء الاصطناعي
              </p>
            </div>
            
            <Link 
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {[
              { id: 'recent', label: 'الأحدث', icon: '🕒' },
              { id: 'popular', label: 'الأكثر مشاهدة', icon: '🔥' },
              { id: 'all', label: 'الكل', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              لا توجد تحليلات حالياً
            </h3>
            <p className="text-blue-200">
              سيتم إضافة التحليلات تلقائياً بعد انتهاء المباريات
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis, index) => (
              <motion.div
                key={analysis._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/analysis/${analysis.matchId}`}>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer group">
                    {/* Match Info */}
                    <div className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={analysis.tournament.logo} 
                            alt={analysis.tournament.name}
                            className="w-8 h-8 object-contain"
                          />
                          <div>
                            <p className="text-xs text-blue-200">{analysis.tournament.name}</p>
                            <p className="text-xs text-gray-400">{formatDate(analysis.date)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-yellow-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-bold">{analysis.views}</span>
                        </div>
                      </div>

                      {/* Teams */}
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex-1 text-center">
                          <img 
                            src={analysis.homeTeam.logo} 
                            alt={analysis.homeTeam.name}
                            className="w-16 h-16 mx-auto mb-2 object-contain"
                          />
                          <p className="text-white font-bold text-sm line-clamp-1">
                            {analysis.homeTeam.name}
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="bg-white/20 rounded-xl px-4 py-2">
                            <p className="text-3xl font-bold text-white">
                              {analysis.score.home} - {analysis.score.away}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 text-center">
                          <img 
                            src={analysis.awayTeam.logo} 
                            alt={analysis.awayTeam.name}
                            className="w-16 h-16 mx-auto mb-2 object-contain"
                          />
                          <p className="text-white font-bold text-sm line-clamp-1">
                            {analysis.awayTeam.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Analysis Preview */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🤖</span>
                        <h3 className="text-lg font-bold text-white">تحليل المباراة</h3>
                      </div>
                      
                      <p className="text-blue-100 text-sm leading-relaxed line-clamp-3">
                        {analysis.analysis.summary || analysis.analysis.fullText?.substring(0, 150) + '...'}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-blue-400 text-sm font-semibold group-hover:text-blue-300 transition-colors">
                          اقرأ التحليل الكامل ←
                        </span>
                        
                        <div className="flex gap-2">
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                            AI
                          </span>
                          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                            جديد
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
            }
