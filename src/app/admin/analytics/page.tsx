'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@/components/CircularProgress';

interface SurveyStats {
  id: string;
  title_en: string;
  title_ar: string;
  response_count: number;
  created_at: string;
}

interface AnalyticsData {
  totalSurveys: number;
  totalResponses: number;
  surveys: SurveyStats[];
}

export default function AnalyticsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);

    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setFromDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  }, [router]);

  useEffect(() => {
    if (token && fromDate && toDate) {
      fetchAnalytics();
    }
  }, [token, fromDate, toDate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('from', fromDate);
      params.append('to', toDate);

      const response = await fetch(`/api/analytics?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch analytics');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const getResponseStatus = (responseCount: number): 'excellent' | 'good' | 'needsImprovement' => {
    if (responseCount >= 100) return 'excellent';
    if (responseCount >= 50) return 'good';
    return 'needsImprovement';
  };

  const getResponsePercentage = (responseCount: number): number => {
    if (!data || data.totalResponses === 0) return 0;
    return Math.round((responseCount / data.totalResponses) * 100);
  };

  if (loading && !data) {
    return (
      <AdminLayout activeTab="analytics">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('admin.analyticsOverview')}</h1>
          <p className="text-gray-600 mt-2">{t('admin.surveyPerformance')}</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('admin.dateRange')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.from')}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.to')}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Surveys Card */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border-l-4 border-yellow-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{t('admin.totalSurveys')}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{data.totalSurveys}</p>
                  </div>
                  <div className="text-4xl text-yellow-600 opacity-20">📊</div>
                </div>
              </div>

              {/* Total Responses Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{t('admin.totalResponses')}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{data.totalResponses}</p>
                  </div>
                  <div className="text-4xl text-blue-600 opacity-20">📝</div>
                </div>
              </div>

              {/* Overall Response Rate Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{t('admin.responsePercentage')}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {data.totalSurveys > 0
                        ? Math.round((data.totalResponses / (data.totalSurveys * 10)) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="text-4xl text-green-600 opacity-20">✓</div>
                </div>
              </div>
            </div>

            {/* Survey Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{t('admin.surveyPerformance')}</h2>

              {data.surveys.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">{t('admin.noDataAvailable')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.surveys.map((survey) => {
                    const status = getResponseStatus(survey.response_count);
                    const percentage = getResponsePercentage(survey.response_count);

                    return (
                      <div
                        key={survey.id}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        {/* Survey Title */}
                        <h3 className="font-semibold text-gray-800 mb-4 line-clamp-2">
                          {isRTL ? survey.title_ar : survey.title_en}
                        </h3>

                        {/* Circular Progress */}
                        <div className="flex justify-center mb-6">
                          <div className="relative">
                            <CircularProgress
                              percentage={Math.min(percentage, 100)}
                              size={140}
                              strokeWidth={6}
                              status={status}
                            />
                          </div>
                        </div>

                        {/* Response Count */}
                        <div className="text-center mb-4">
                          <p className="text-2xl font-bold text-gray-800">
                            {survey.response_count}
                          </p>
                          <p className="text-sm text-gray-600">{t('admin.totalResponses')}</p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex justify-center">
                          {status === 'excellent' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              ✓ {t('admin.excellent')}
                            </span>
                          )}
                          {status === 'good' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              ◐ {t('admin.good')}
                            </span>
                          )}
                          {status === 'needsImprovement' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              ✕ {t('admin.needsImprovement')}
                            </span>
                          )}
                        </div>

                        {/* Date Created */}
                        <p className="text-xs text-gray-500 text-center mt-4">
                          {new Date(survey.created_at).toLocaleDateString(
                            isRTL ? 'ar-SA' : 'en-US'
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

