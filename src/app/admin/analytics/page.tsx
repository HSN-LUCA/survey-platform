'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useTranslation } from 'react-i18next';

interface SurveyStats {
  id: string;
  title_en: string;
  title_ar: string;
  response_count: number;
  satisfaction_score: number;
  created_at: string;
}

interface AnalyticsData {
  totalSurveys: number;
  totalResponses: number;
  surveys: SurveyStats[];
  demographics: {
    ageRange: Record<string, number>;
    gender: Record<string, number>;
  };
  satisfactionDistribution: {
    veryDissatisfied: number;
    dissatisfied: number;
    neutral: number;
    satisfied: number;
    verySatisfied: number;
  };
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

    // Set default date range (1-1-2026 to 31-12-2026)
    setFromDate('2026-01-01');
    setToDate('2026-12-31');
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

  const getResponseStatus = (satisfactionScore: number): 'excellent' | 'good' | 'needsImprovement' => {
    if (satisfactionScore >= 80) return 'excellent';
    if (satisfactionScore >= 60) return 'good';
    return 'needsImprovement';
  };

  const getResponsePercentage = (satisfactionScore: number): number => {
    return satisfactionScore;
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
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">{t('admin.dateRangeLabel')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                {t('admin.from')}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                {t('admin.to')}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black text-sm"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {/* Total Surveys Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-4 md:p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm font-medium">{t('admin.totalSurveys')}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">{data?.totalSurveys || 0}</p>
              </div>
              <div className="text-3xl md:text-4xl text-yellow-600 opacity-20">📊</div>
            </div>
          </div>

          {/* Total Responses Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-4 md:p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm font-medium">{t('admin.totalResponses')}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">{data?.totalResponses || 0}</p>
              </div>
              <div className="text-3xl md:text-4xl text-blue-600 opacity-20">📝</div>
            </div>
          </div>

          {/* Overall Response Rate Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-4 md:p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm font-medium">{t('admin.responseRate')}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                  {data && data.totalSurveys > 0
                    ? Math.round((data.totalResponses / (data.totalSurveys * 10)) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="text-3xl md:text-4xl text-green-600 opacity-20">✓</div>
            </div>
          </div>
        </div>

        {data && (
          <>
            {/* Satisfaction Score Bar */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">{t('admin.satisfactionScore')}</h2>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4 overflow-x-auto pb-2">
                {/* Very Dissatisfied */}
                <div className="flex flex-col items-center flex-1 min-w-max sm:min-w-0">
                  <div className="text-3xl md:text-4xl mb-2">😞</div>
                  <div className="w-16 md:w-full bg-red-200 rounded-lg h-10 md:h-12 flex items-center justify-center">
                    <span className="text-sm md:text-lg font-bold text-red-700">{data.satisfactionDistribution?.veryDissatisfied || 0}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">{t('survey.veryDissatisfied')}</p>
                </div>

                {/* Dissatisfied */}
                <div className="flex flex-col items-center flex-1 min-w-max sm:min-w-0">
                  <div className="text-3xl md:text-4xl mb-2">😕</div>
                  <div className="w-16 md:w-full bg-orange-200 rounded-lg h-10 md:h-12 flex items-center justify-center">
                    <span className="text-sm md:text-lg font-bold text-orange-700">{data.satisfactionDistribution?.dissatisfied || 0}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">{t('survey.dissatisfied')}</p>
                </div>

                {/* Neutral */}
                <div className="flex flex-col items-center flex-1 min-w-max sm:min-w-0">
                  <div className="text-3xl md:text-4xl mb-2">😐</div>
                  <div className="w-16 md:w-full bg-yellow-200 rounded-lg h-10 md:h-12 flex items-center justify-center">
                    <span className="text-sm md:text-lg font-bold text-yellow-700">{data.satisfactionDistribution?.neutral || 0}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">{t('survey.neutral')}</p>
                </div>

                {/* Satisfied */}
                <div className="flex flex-col items-center flex-1 min-w-max sm:min-w-0">
                  <div className="text-3xl md:text-4xl mb-2">🙂</div>
                  <div className="w-16 md:w-full bg-green-200 rounded-lg h-10 md:h-12 flex items-center justify-center">
                    <span className="text-sm md:text-lg font-bold text-green-700">{data.satisfactionDistribution?.satisfied || 0}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">{t('survey.satisfied')}</p>
                </div>

                {/* Very Satisfied */}
                <div className="flex flex-col items-center flex-1 min-w-max sm:min-w-0">
                  <div className="text-3xl md:text-4xl mb-2">😄</div>
                  <div className="w-16 md:w-full bg-emerald-200 rounded-lg h-10 md:h-12 flex items-center justify-center">
                    <span className="text-sm md:text-lg font-bold text-emerald-700">{data.satisfactionDistribution?.verySatisfied || 0}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">{t('survey.verySatisfied')}</p>
                </div>
              </div>
            </div>

            {/* Demographics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Age Range Chart */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">{t('admin.ageRangeDistribution')}</h2>
                {Object.keys(data.demographics.ageRange).length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <p className="text-gray-600 text-sm">{t('admin.noAgeRangeData')}</p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {Object.entries(data.demographics.ageRange)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([ageRange, count]) => {
                        const percentage =
                          data.totalResponses > 0
                            ? Math.round((count / data.totalResponses) * 100)
                            : 0;
                        return (
                          <div key={ageRange}>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs md:text-sm font-medium text-gray-700 w-20 md:w-24">{ageRange}</span>
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-6 md:h-8">
                                  <div
                                    className="bg-blue-600 h-6 md:h-8 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                                    style={{ width: `${Math.max(percentage, 5)}%` }}
                                  >
                                    <span className="text-xs font-bold text-white">{percentage}%</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs md:text-sm font-semibold text-gray-900 w-12 md:w-16 text-right">
                                {count}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Gender Chart */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">{t('admin.genderDistribution')}</h2>
                {Object.keys(data.demographics.gender).length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <p className="text-gray-600 text-sm">{t('admin.noGenderData')}</p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {Object.entries(data.demographics.gender)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([gender, count]) => {
                        const percentage =
                          data.totalResponses > 0
                            ? Math.round((count / data.totalResponses) * 100)
                            : 0;
                        const colors: Record<string, string> = {
                          Male: 'bg-blue-600',
                          Female: 'bg-pink-600',
                          Other: 'bg-purple-600',
                        };
                        const color = colors[gender] || 'bg-gray-600';
                        return (
                          <div key={gender}>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs md:text-sm font-medium text-gray-700 w-20 md:w-24">{gender}</span>
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-6 md:h-8">
                                  <div
                                    className={`${color} h-6 md:h-8 rounded-full transition-all duration-300 flex items-center justify-end pr-2`}
                                    style={{ width: `${Math.max(percentage, 5)}%` }}
                                  >
                                    <span className="text-xs font-bold text-white">{percentage}%</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs md:text-sm font-semibold text-gray-900 w-12 md:w-16 text-right">
                                {count}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">{t('admin.surveyPerformance')}</h2>

              {data.surveys.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <p className="text-gray-600 text-sm">{t('admin.noDataAvailable')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {data.surveys.map((survey) => {
                    const satisfactionScore = survey.satisfaction_score;
                    const status = getResponseStatus(satisfactionScore);

                    return (
                      <div
                        key={survey.id}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        {/* Survey Title */}
                        <h3 className="font-semibold text-gray-800 mb-3 md:mb-4 line-clamp-2 text-center text-sm md:text-base">
                          {isRTL ? survey.title_ar : survey.title_en}
                        </h3>

                        {/* Circular Progress with Percentage */}
                        <div className="flex justify-center mb-4 md:mb-6">
                          <div className="relative w-24 md:w-32 h-24 md:h-32">
                            <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                              {/* Background circle */}
                              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                              
                              {/* Progress circle */}
                              {satisfactionScore > 0 && (
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="none"
                                  stroke={
                                    status === 'excellent'
                                      ? '#10b981'
                                      : status === 'good'
                                        ? '#f59e0b'
                                        : '#ef4444'
                                  }
                                  strokeWidth="8"
                                  strokeDasharray={`${(satisfactionScore / 100) * 314} 314`}
                                  strokeLinecap="round"
                                />
                              )}
                            </svg>
                            
                            {/* Center percentage */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-lg md:text-2xl font-bold text-gray-800">{satisfactionScore}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Date Created */}
                        <p className="text-xs text-gray-500 text-center mt-3 md:mt-4">
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

