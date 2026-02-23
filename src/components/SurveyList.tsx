'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Survey } from '@/types';

export default function SurveyList() {
  const { t, i18n } = useTranslation();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerType, setCustomerType] = useState<'all' | 'pilgrims' | 'staff'>('all');
  const [search, setSearch] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchSurveys();
    }
  }, [token, customerType, search]);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (customerType !== 'all') {
        params.append('customer_type', customerType);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/surveys?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Failed to fetch surveys');
      }

      const data = await response.json();
      setSurveys(data);
    } catch (err) {
      console.error('Error fetching surveys:', err);
      setError(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (surveyId: string) => {
    if (!confirm(t('messages.confirmDelete'))) {
      return;
    }

    try {
      console.log('Deleting survey:', surveyId);
      console.log('Token:', token ? 'Present' : 'Missing');

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);
      console.log('Delete response headers:', {
        contentType: response.headers.get('content-type'),
      });

      // Handle response based on status
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        
        try {
          const responseText = await response.text();
          console.log('Delete error response text:', responseText);
          
          if (responseText) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData?.error || errorMessage;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }

        console.error('Delete failed:', errorMessage);
        throw new Error(errorMessage);
      }

      // Success case
      console.log('Delete successful');
      setSurveys(surveys.filter((s) => s.id !== surveyId));
      setError(null);
    } catch (err) {
      console.error('Error deleting survey:', err);
      const errorMessage = err instanceof Error ? err.message : t('errors.serverError');
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">{t('admin.surveys')}</h1>
        <Link
          href="/admin/surveys/create"
          className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
        >
          {t('admin.createNewSurvey')}
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.searchSurveys')}
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('admin.searchSurveys')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black"
            />
          </div>

          {/* Customer Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.filterByCustomerType')}
            </label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black"
            >
              <option value="all">{t('common.language')}</option>
              <option value="pilgrims">{t('survey.pilgrims')}</option>
              <option value="staff">{t('survey.staff')}</option>
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

      {/* Surveys Table */}
      {surveys.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">{t('survey.noSurveys')}</p>
        </div>
      ) : (
        <div className={`bg-white rounded-lg shadow overflow-x-auto ${isRTL ? 'rtl' : 'ltr'}`}>
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-left min-w-[200px]">
                  {t('survey.title')}
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-left min-w-[120px]">
                  {t('survey.customerType')}
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center min-w-[100px]">
                  {t('admin.totalResponses')}
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-left min-w-[100px]">
                  {t('common.date')}
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right min-w-[200px]">
                  {t('common.options')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {surveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 min-w-[200px]">
                    <div>
                      <p className="font-medium text-gray-900">
                        {isRTL ? survey.title_ar : survey.title_en}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isRTL ? survey.description_ar : survey.description_en}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 min-w-[120px]">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {survey.customer_type === 'pilgrims'
                        ? t('survey.pilgrims')
                        : t('survey.staff')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-900 font-medium text-center min-w-[100px]">
                    {survey.response_count || 0}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 min-w-[100px]">
                    {new Date(survey.created_at).toLocaleDateString(
                      isRTL ? 'ar-SA' : 'en-US'
                    )}
                  </td>
                  <td className="px-4 py-4 text-right space-x-2 min-w-[200px]">
                    <Link
                      href={`/admin/surveys/${survey.id}/edit`}
                      className="inline-block px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      {t('admin.editSurvey')}
                    </Link>
                    <Link
                      href={`/admin/surveys/${survey.id}`}
                      className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      {t('survey.viewSurvey')}
                    </Link>
                    <button
                      onClick={() => handleDelete(survey.id)}
                      className="inline-block px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      {t('common.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
