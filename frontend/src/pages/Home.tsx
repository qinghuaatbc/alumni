import React, { useState, useEffect, useCallback } from 'react';
import { alumniApi } from '../api/alumni';
import type { AlumniProfile, AlumniStats } from '../api/alumni';
import AlumniCard from '../components/AlumniCard';
import { useSettings } from '../contexts/SettingsContext';

const Home: React.FC = () => {
  const { t } = useSettings();
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [stats, setStats] = useState<AlumniStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    name: '',
    className: '',
    city: '',
    graduationYear: '',
    page: 1,
    limit: 12,
  });

  const [searchInput, setSearchInput] = useState('');

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query: any = {
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.name) query.name = filters.name;
      if (filters.className) query.className = filters.className;
      if (filters.city) query.city = filters.city;
      if (filters.graduationYear) query.graduationYear = Number(filters.graduationYear);

      const res = await alumniApi.getAll(query);
      setAlumni(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      setError('Failed to load alumni profiles');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const s = await alumniApi.getStats();
      setStats(s);
    } catch {
      // stats are optional
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, name: searchInput, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ name: '', className: '', city: '', graduationYear: '', page: 1, limit: 12 });
  };

  const hasActiveFilters = filters.name || filters.className || filters.city || filters.graduationYear;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">华北电力大学无线871</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('home_subtitle')}</p>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('total_alumni')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.cityDistribution.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('cities')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.yearDistribution.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('grad_years')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.cityDistribution[0]?.city || '-'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('top_city')}</p>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('search_by_name')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
            {t('search')}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{t('class')}</label>
            <input
              type="text"
              value={filters.className}
              onChange={(e) => handleFilterChange('className', e.target.value)}
              placeholder="e.g. Class 2020-A"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{t('city')}</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="e.g. Beijing"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{t('graduation_year')}</label>
            <input
              type="number"
              value={filters.graduationYear}
              onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
              placeholder="e.g. 2020"
              min="1950"
              max="2100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('found_results')} <span className="font-semibold text-gray-800 dark:text-gray-200">{total}</span> {t('results')}
            </p>
            <button onClick={clearFilters} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium">
              {t('clear_filters')}
            </button>
          </div>
        )}
      </div>

      {/* Alumni grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
          <button onClick={fetchAlumni} className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">{t('try_again')}</button>
        </div>
      ) : alumni.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('no_alumni_found')}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {hasActiveFilters ? t('try_adjust') : t('be_first')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {alumni.map((profile) => (
              <AlumniCard key={profile.id} profile={profile} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t('prev')}
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let page: number;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (filters.page <= 4) {
                  page = i + 1;
                } else if (filters.page >= totalPages - 3) {
                  page = totalPages - 6 + i;
                } else {
                  page = filters.page - 3 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === filters.page
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t('next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
