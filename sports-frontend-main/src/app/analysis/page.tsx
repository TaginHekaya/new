'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  views: number;
  likes?: number;
  createdAt: string;
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

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.homeTeam.name.toLowerCase().includes(q) ||
          a.awayTeam.name.toLowerCase().includes(q) ||
          a.tournament.name.toLowerCase().includes(q)
      );
    }

    switch (filter) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;

      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;

      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(a => new Date(a.createdAt).getTime() >= today.getTime());
        break;
    }

    setFilteredAnalyses(filtered);
  }, [analyses, searchQuery, filter]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatMatchDate = (d: string) =>
    new Date(d).toLocaleString('ar-EG', { month: 'short', day: 'numeric' });

  const loadMore = () => {
    if (hasMore && !loading) setPage(p => p + 1);
  };

  if (loading && page === 1)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        ⏳ جاري تحميل التحليلات…
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto p-4">

        {error && <div className="text-red-400 p-4">{error}</div>}

        {filteredAnalyses.length === 0 && !loading && !error && (
          <div className="text-center text-white p-10">لا توجد تحليلات</div>
        )}

        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'}>

          {filteredAnalyses.map(a => (
            <Link key={a._id} href={`/analysis/${a.matchId}`}>
              <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white hover:border-blue-500 transition">
                <div className="flex items-center justify-between mb-4">
                  <img src={a.tournament.logo} className="w-10 h-10" />
                  <span className="text-xs">{formatMatchDate(a.date)}</span>
                </div>

                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="text-center">
                    <img src={a.homeTeam.logo} className="w-16 h-16 mx-auto" />
                    <p>{a.homeTeam.name}</p>
                  </div>

                  <h2 className="text-3xl font-bold">
                    {a.score.home} - {a.score.away}
                  </h2>

                  <div className="text-center">
                    <img src={a.awayTeam.logo} className="w-16 h-16 mx-auto" />
                    <p>{a.awayTeam.name}</p>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-300 mb-2">
                  {a.tournament.name}
                </p>

                <p className="text-xs text-center text-blue-300">
                  {formatDate(a.createdAt)}
                </p>

                <p classname="text-xs text-center text-yellow-400 mt-2">
                  👁 {a.views || 0}
                </p>
              </div>
            </Link>
          ))}

        </div>

        {hasMore && (
          <div className="text-center mt-6">
            <button onClick={loadMore} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
              تحميل المزيد
            </button>
          </div>
        )}
      </div>
    </div>
  );
                                   }
