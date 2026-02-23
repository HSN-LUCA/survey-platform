'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useTranslation } from 'react-i18next';

interface Respondent {
  id: string;
  survey_id: string;
  survey_title: string;
  email: string;
  phone: string;
  hajj_number: string;
  gender: string;
  age_range: string;
  education_level: string;
  nationality: string;
  submitted_at: string;
}

export default function RespondentsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState('all');
  const [surveys, setSurveys] = useState<{ id: string; title: string }[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      fetchRespondents();
      fetchSurveys();
    }
  }, [token]);

  const fetchRespondents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/respondents');

      if (!response.ok) {
        throw new Error('Failed to fetch respondents');
      }

      const data = await response.json();
      setRespondents(data);
    } catch (err) {
      console.error('Error fetching respondents:', err);
      setError(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/surveys', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSurveys(data.map((s: any) => ({ id: s.id, title: isRTL ? s.title_ar : s.title_en })));
      }
    } catch (err) {
      console.error('Error fetching surveys:', err);
    }
  };

  const filteredRespondents = respondents.filter((respondent) => {
    const matchesSearch =
      (respondent.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (respondent.phone || '').includes(searchTerm) ||
      (respondent.hajj_number || '').includes(searchTerm) ||
      (respondent.nationality?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesSurvey = selectedSurvey === 'all' || respondent.survey_id === selectedSurvey;

    return matchesSearch && matchesSurvey;
  });

  const deleteRespondent = async (respondentId: string) => {
    if (!window.confirm(t('admin.confirmDeleteRespondent'))) {
      return;
    }

    try {
      setDeletingId(respondentId);
      const response = await fetch(`/api/respondents/${respondentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete respondent');
      }

      setRespondents((prev) => prev.filter((r) => r.id !== respondentId));
    } catch (err) {
      console.error('Error deleting respondent:', err);
      setError(t('errors.serverError'));
    } finally {
      setDeletingId(null);
    }
  };

  const exportToCSV = () => {
    const headers = [
      t('admin.respondentEmail'),
      t('admin.respondentPhone'),
      t('admin.respondentHajjNumber'),
      t('admin.respondentGender'),
      t('admin.respondentAgeRange'),
      t('admin.respondentEducation'),
      t('admin.respondentNationality'),
      t('admin.respondentSurvey'),
      t('admin.respondentDate'),
    ];
    const rows = filteredRespondents.map((r) => [
      r.email,
      r.phone,
      r.hajj_number,
      r.gender,
      r.age_range,
      r.education_level,
      r.nationality,
      r.survey_title,
      new Date(r.submitted_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respondents-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AdminLayout activeTab="respondents">
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
    <AdminLayout activeTab="respondents">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('admin.respondentsTitle')}</h1>
            <p className="text-gray-600 mt-2">{t('admin.respondentsDescription')}</p>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {t('admin.exportCSV')}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.search')}
              </label>
              <input
                type="text"
                placeholder={t('admin.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.respondentSurvey')}
              </label>
              <select
                value={selectedSurvey}
                onChange={(e) => setSelectedSurvey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black"
              >
                <option value="all">{t('admin.allSurveys')}</option>
                {surveys.map((survey) => (
                  <option key={survey.id} value={survey.id}>
                    {survey.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Respondents Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredRespondents.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">{t('admin.noRespondentsFound')}</p>
            </div>
          ) : (
            <div className={`overflow-x-auto ${isRTL ? 'rtl' : 'ltr'}`}>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className={`px-4 md:px-6 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('admin.respondentEmail')}
                    </th>
                    <th className={`px-4 md:px-6 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('admin.respondentPhone')}
                    </th>
                    <th className={`px-4 md:px-6 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('admin.respondentHajjNumber')}
                    </th>
                    <th className={`px-4 md:px-6 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('admin.respondentGender')}
                    </th>
                    <th className={`px-4 md:px-6 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('admin.respondentAgeRange')}
                    </th>
                    <th className={`px-4 md:px-6 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('admin.respondentSurvey')}
                    </th>
                    <th className={`px-4 md:px-6 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('admin.respondentDate')}
                    </th>
                    <th className={`px-4 md:px-6 py-3 text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('common.action')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRespondents.map((respondent) => (
                    <tr key={respondent.id} className="hover:bg-gray-50 transition-colors">
                      <td className={`px-4 md:px-6 py-4 text-sm text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>{respondent.email}</td>
                      <td className={`px-4 md:px-6 py-4 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{respondent.phone}</td>
                      <td className={`px-4 md:px-6 py-4 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{respondent.hajj_number}</td>
                      <td className={`px-4 md:px-6 py-4 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{respondent.gender}</td>
                      <td className={`px-4 md:px-6 py-4 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {respondent.age_range}
                        </span>
                      </td>
                      <td className={`px-4 md:px-6 py-4 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{respondent.survey_title}</td>
                      <td className={`px-4 md:px-6 py-4 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {new Date(respondent.submitted_at).toLocaleDateString()}
                      </td>
                      <td className={`px-4 md:px-6 py-4 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        <button
                          onClick={() => deleteRespondent(respondent.id)}
                          disabled={deletingId === respondent.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {deletingId === respondent.id ? '...' : t('admin.deleteRespondent')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <p className="text-gray-700">
            {t('admin.showingRespondents')} <span className="font-bold">{filteredRespondents.length}</span>{' '}
            {t('admin.respondentsOf')} <span className="font-bold">{respondents.length}</span>{' '}
            {t('admin.respondents')}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
