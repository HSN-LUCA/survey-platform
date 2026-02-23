'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useTranslation } from 'react-i18next';

interface SurveyReport {
  id: string;
  title_en: string;
  title_ar: string;
  totalInvitations: number;
  totalResponses: number;
  responseRate: number;
  completionRate: number;
  satisfactionRate: number;
  answerRate: number;
  topStrengths: string[];
  bottomImprovements: string[];
  demographics: {
    gender: Record<string, number>;
    ageRange: Record<string, number>;
    nationality: Record<string, number>;
  };
}

export default function ReportsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [reports, setReports] = useState<SurveyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchReports();
    }
  }, [token]);

  useEffect(() => {
    // Add print styles
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        aside,
        nav,
        .no-print {
          display: none !important;
        }
        body {
          margin: 0;
          padding: 0;
        }
        main {
          width: 100%;
          margin: 0;
          padding: 20px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/reports', {
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
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data);
      if (data.length > 0) {
        setSelectedSurvey(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const currentReport = reports.find((r) => r.id === selectedSurvey);

  const exportToCSV = () => {
    if (!currentReport) return;

    const headers = [
      t('survey.title'),
      t('admin.totalInvitationsSent'),
      t('admin.totalResponses'),
      t('admin.responseRate'),
      t('admin.completionRate'),
      t('admin.satisfactionRate'),
      t('admin.answerRate'),
    ];

    const rows = [
      [
        isRTL ? currentReport.title_ar : currentReport.title_en,
        currentReport.totalInvitations,
        currentReport.totalResponses,
        `${currentReport.responseRate.toFixed(2)}%`,
        `${currentReport.completionRate.toFixed(2)}%`,
        `${currentReport.satisfactionRate.toFixed(2)}%`,
        `${currentReport.answerRate.toFixed(2)}%`,
      ],
    ];

    // Escape CSV values and handle special characters
    const escapeCSV = (value: any) => {
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\n');
    
    // Add UTF-8 BOM for proper Arabic encoding in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${currentReport.id}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <AdminLayout activeTab="reports">
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
    <AdminLayout activeTab="reports">
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('admin.reports')}</h1>
            <p className="text-gray-600 mt-2">{t('admin.executiveSummary')}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('admin.exportCSV')}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('admin.printReport')}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Survey Selector */}
        {reports.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.respondentSurvey')}
            </label>
            <select
              value={selectedSurvey || ''}
              onChange={(e) => setSelectedSurvey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black"
            >
              {reports.map((report) => (
                <option key={report.id} value={report.id}>
                  {isRTL ? report.title_ar : report.title_en}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Executive Summary Report */}
        {currentReport && (
          <div className="space-y-6 print:space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Invitations */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-l-4 border-blue-600">
                <p className="text-gray-600 text-sm font-medium">{t('admin.totalInvitationsSent')}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{currentReport.totalInvitations}</p>
              </div>

              {/* Total Responses */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-600">
                <p className="text-gray-600 text-sm font-medium">{t('admin.totalResponses')}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{currentReport.totalResponses}</p>
              </div>

              {/* Response Rate */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border-l-4 border-purple-600">
                <p className="text-gray-600 text-sm font-medium">{t('admin.responseRate')}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{currentReport.responseRate.toFixed(2)}%</p>
              </div>

              {/* Satisfaction Rate */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border-l-4 border-yellow-600">
                <p className="text-gray-600 text-sm font-medium">{t('admin.satisfactionRate')}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{currentReport.satisfactionRate.toFixed(2)}%</p>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Completion Rate */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
                <p className="text-gray-600 text-sm font-medium">{t('admin.completionRate')}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{currentReport.completionRate.toFixed(2)}%</p>
              </div>

              {/* Answer Rate */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-600">
                <p className="text-gray-600 text-sm font-medium">{t('admin.answerRate')}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{currentReport.answerRate.toFixed(2)}%</p>
              </div>
            </div>

            {/* Top Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Strengths */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💪</span>
                  {t('admin.topStrengths')}
                </h3>
                <ul className="space-y-2">
                  {currentReport.topStrengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-1">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Improvements */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  {t('admin.bottomImprovements')}
                </h3>
                <ul className="space-y-2">
                  {currentReport.bottomImprovements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-1">!</span>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Demographic Breakdown */}
            <div className="bg-white rounded-lg shadow p-6 space-y-8">
              <h3 className="text-lg font-bold text-gray-800">{t('admin.demographicBreakdown')}</h3>
              
              {/* Gender Table */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">{t('survey.gender')}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('survey.gender')}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">{t('admin.totalResponses')}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(currentReport.demographics.gender).map(([key, value], idx) => {
                        const total = Object.values(currentReport.demographics.gender).reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return (
                          <tr key={key} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                            <td className="px-4 py-3 text-sm text-gray-700">{key}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">{value}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Age Range Table */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">{t('survey.ageRange')}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('survey.ageRange')}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">{t('admin.totalResponses')}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(currentReport.demographics.ageRange).map(([key, value], idx) => {
                        const total = Object.values(currentReport.demographics.ageRange).reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return (
                          <tr key={key} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                            <td className="px-4 py-3 text-sm text-gray-700">{key}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">{value}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Nationality Table */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">{t('survey.nationality')}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('survey.nationality')}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">{t('admin.totalResponses')}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(currentReport.demographics.nationality)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, value], idx) => {
                          const total = Object.values(currentReport.demographics.nationality).reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return (
                            <tr key={key} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                              <td className="px-4 py-3 text-sm text-gray-700">{key}</td>
                              <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">{value}</td>
                              <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">{percentage}%</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {reports.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">{t('survey.noSurveys')}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
