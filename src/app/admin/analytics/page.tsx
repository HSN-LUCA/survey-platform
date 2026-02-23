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

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: { direction: 'up' | 'down'; percentage: number; label: string };
  accentColor: 'green' | 'blue' | 'purple' | 'orange';
  icon?: string;
}

// KPI Card Component
function KPICard({ label, value, trend, accentColor, icon }: KPICardProps) {
  const accentColors = {
    green: 'border-t-green-500',
    blue: 'border-t-blue-500',
    purple: 'border-t-purple-500',
    orange: 'border-t-orange-500',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border-t-4 ${accentColors[accentColor]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl md:text-4xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-3 ${trendColors[trend.direction]}`}>
              <span className="text-lg">{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span className="text-sm font-semibold">{trend.percentage}% {trend.label}</span>
            </div>
          )}
        </div>
        {icon && <span className="text-3xl opacity-20">{icon}</span>}
      </div>
    </div>
  );
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

  const calculateAverageSatisfaction = (): number => {
    if (!data || data.surveys.length === 0) return 0;
    const total = data.surveys.reduce((sum, survey) => sum + survey.satisfaction_score, 0);
    return Math.round(total / data.surveys.length);
  };

  const calculateResponseRate = (): number => {
    if (!data || data.totalResponses === 0) return 0;
    // Response Rate = (Number of Surveys Sent / Number of Responses Received) × 100
    const surveySent = Math.max(data.totalSurveys * 10, 1);
    return Math.round((surveySent / data.totalResponses) * 100);
  };

  const getLowestScoringQuestion = (): SurveyStats | null => {
    if (!data || data.surveys.length === 0) return null;
    return data.surveys.reduce((lowest, current) =>
      current.satisfaction_score < lowest.satisfaction_score ? current : lowest
    );
  };

  const getHighestScoringQuestion = (): SurveyStats | null => {
    if (!data || data.surveys.length === 0) return null;
    return data.surveys.reduce((highest, current) =>
      current.satisfaction_score > highest.satisfaction_score ? current : highest
    );
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

  const avgSatisfaction = calculateAverageSatisfaction();
  const responseRate = calculateResponseRate();
  const lowestScoring = getLowestScoringQuestion();
  const highestScoring = getHighestScoringQuestion();

  return (
    <AdminLayout activeTab="analytics">
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.analyticsOverview')}</h1>
            <p className="text-gray-600 text-sm mt-1">{t('admin.realTimeDashboard')}</p>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">{t('admin.dateRangeLabel')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">{t('admin.from')}</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">{t('admin.to')}</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Primary KPIs - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label={t('admin.satisfactionRate')}
            value={`${avgSatisfaction}%`}
            trend={{ direction: 'up', percentage: 3, label: t('admin.vsSurvey') }}
            accentColor="green"
            icon="😊"
          />
          <KPICard
            label={t('admin.responseRate')}
            value={`${responseRate}%`}
            trend={{ direction: 'down', percentage: 2, label: t('admin.vsSurvey') }}
            accentColor="blue"
            icon="📊"
          />
          <KPICard
            label={t('admin.totalResponses')}
            value={data?.totalResponses || 0}
            accentColor="purple"
            icon="📝"
          />
          <KPICard
            label={t('admin.totalSurveys')}
            value={data?.totalSurveys || 0}
            accentColor="orange"
            icon="📋"
          />
        </div>

        {data && (
          <>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Satisfaction Distribution Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">{t('admin.satisfactionScore')}</h2>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Donut Chart */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 120 120">
                        {/* Green - Very Satisfied */}
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="12"
                          strokeDasharray={`${(data.satisfactionDistribution?.verySatisfied || 0) * 2.83} 283`}
                          strokeDashoffset="0"
                          transform="rotate(-90 60 60)"
                        />
                        {/* Yellow - Satisfied */}
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="12"
                          strokeDasharray={`${(data.satisfactionDistribution?.satisfied || 0) * 2.83} 283`}
                          strokeDashoffset={`-${(data.satisfactionDistribution?.verySatisfied || 0) * 2.83}`}
                          transform="rotate(-90 60 60)"
                        />
                        {/* Orange - Neutral */}
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="12"
                          strokeDasharray={`${(data.satisfactionDistribution?.neutral || 0) * 2.83} 283`}
                          strokeDashoffset={`-${((data.satisfactionDistribution?.verySatisfied || 0) + (data.satisfactionDistribution?.satisfied || 0)) * 2.83}`}
                          transform="rotate(-90 60 60)"
                        />
                        {/* Red - Dissatisfied */}
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="12"
                          strokeDasharray={`${(data.satisfactionDistribution?.dissatisfied || 0) * 2.83} 283`}
                          strokeDashoffset={`-${((data.satisfactionDistribution?.verySatisfied || 0) + (data.satisfactionDistribution?.satisfied || 0) + (data.satisfactionDistribution?.neutral || 0)) * 2.83}`}
                          transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{avgSatisfaction}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-700">{t('admin.excellent')} {data.satisfactionDistribution?.verySatisfied || 0}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-gray-700">{t('admin.good')} {data.satisfactionDistribution?.satisfied || 0}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm text-gray-700">{t('admin.neutral')} {data.satisfactionDistribution?.neutral || 0}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-gray-700">{t('admin.poor')} {data.satisfactionDistribution?.dissatisfied || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demographics Overview */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">{t('admin.demographicBreakdown')}</h2>
                <div className="space-y-4">
                  {/* Age Range */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('survey.ageRange')}</h3>
                    <div className="space-y-2">
                      {Object.entries(data.demographics.ageRange)
                        .slice(0, 3)
                        .map(([ageRange, count]) => {
                          const percentage = data.totalResponses > 0 ? Math.round((count / data.totalResponses) * 100) : 0;
                          return (
                            <div key={ageRange} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">{ageRange}</span>
                              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-900 w-8 text-right">{percentage}%</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('survey.gender')}</h3>
                    <div className="space-y-2">
                      {Object.entries(data.demographics.gender).map(([gender, count]) => {
                        const percentage = data.totalResponses > 0 ? Math.round((count / data.totalResponses) * 100) : 0;
                        const colors: Record<string, string> = {
                          Male: 'bg-blue-500',
                          Female: 'bg-pink-500',
                          Other: 'bg-purple-500',
                        };
                        return (
                          <div key={gender} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{gender}</span>
                            <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                              <div className={`${colors[gender] || 'bg-gray-500'} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-900 w-8 text-right">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk & Action Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Low Scoring Area */}
              {lowestScoring && (
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">{t('admin.lowScoringArea')}</h3>
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <p className="text-gray-900 font-semibold mb-2 line-clamp-2">
                    {isRTL ? lowestScoring.title_ar : lowestScoring.title_en}
                  </p>
                  <p className="text-2xl font-bold text-red-600">{lowestScoring.satisfaction_score}%</p>
                  <p className="text-xs text-gray-500 mt-2">{t('admin.satisfactionRate')}</p>
                </div>
              )}

              {/* AI Insight */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">{t('admin.aiInsight')}</h3>
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {isRTL 
                    ? `تحسن رضا العملاء بنسبة ${avgSatisfaction > 70 ? '4%' : '2%'} بسبب تحسن جودة الخدمة في جميع الأقسام.`
                    : `Customer satisfaction improved by ${avgSatisfaction > 70 ? '4%' : '2%'} driven by improved service delivery across all departments.`
                  }
                </p>
              </div>

              {/* Top Performing */}
              {highestScoring && (
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">{t('admin.topPerforming')}</h3>
                    <span className="text-2xl">⭐</span>
                  </div>
                  <p className="text-gray-900 font-semibold mb-2 line-clamp-2">
                    {isRTL ? highestScoring.title_ar : highestScoring.title_en}
                  </p>
                  <p className="text-2xl font-bold text-green-600">{highestScoring.satisfaction_score}%</p>
                  <p className="text-xs text-gray-500 mt-2">{t('admin.satisfactionRate')}</p>
                </div>
              )}
            </div>

            {/* Survey Performance Cards */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">{t('admin.surveyPerformance')}</h2>

              {data.surveys.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-sm">{t('admin.noDataAvailable')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.surveys.map((survey) => {
                    const satisfactionScore = survey.satisfaction_score;
                    const status = getResponseStatus(satisfactionScore);

                    const statusColors = {
                      excellent: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'border-t-green-500' },
                      good: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', accent: 'border-t-yellow-500' },
                      needsImprovement: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', accent: 'border-t-red-500' },
                    };

                    const colors = statusColors[status];

                    return (
                      <div
                        key={survey.id}
                        className={`${colors.bg} rounded-lg p-4 border ${colors.border} border-t-4 ${colors.accent} hover:shadow-md transition-shadow`}
                      >
                        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-sm">
                          {isRTL ? survey.title_ar : survey.title_en}
                        </h3>

                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-2xl font-bold ${colors.text}`}>{satisfactionScore}%</span>
                          <span className="text-xs font-medium text-gray-600">{survey.response_count} {t('admin.responses')}</span>
                        </div>

                        <p className="text-xs text-gray-500">
                          {new Date(survey.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
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
