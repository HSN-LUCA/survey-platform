'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useTranslation } from 'react-i18next';

interface Respondent {
  id: string;
  survey_id: string;
  survey_title: string;
  full_name: string;
  email: string;
  phone: string;
  hajj_number: string;
  category: string;
  created_at: string;
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

      const response = await fetch('/api/respondents', {
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
      respondent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      respondent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      respondent.phone.includes(searchTerm) ||
      respondent.hajj_number.includes(searchTerm);

    const matchesSurvey = selectedSurvey === 'all' || respondent.survey_id === selectedSurvey;

    return matchesSearch && matchesSurvey;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Hajj Number', 'Category', 'Survey', 'Date'];
    const rows = filteredRespondents.map((r) => [
      r.full_name,
      r.email,
      r.phone,
      r.hajj_number,
      r.category,
      r.survey_title,
      new Date(r.created_at).toLocaleDateString(),
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
            <h1 className="text-3xl font-bold text-gray-800">Respondents</h1>
            <p className="text-gray-600 mt-2">View and manage survey respondents</p>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            📥 Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Name, email, phone, or hajj number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Survey</label>
              <select
                value={selectedSurvey}
                onChange={(e) => setSelectedSurvey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 text-black"
              >
                <option value="all">All Surveys</option>
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
              <p className="text-gray-600">No respondents found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Hajj #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Survey</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRespondents.map((respondent) => (
                    <tr key={respondent.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{respondent.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{respondent.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{respondent.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{respondent.hajj_number}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {respondent.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{respondent.survey_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(respondent.created_at).toLocaleDateString()}
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
            Showing <span className="font-bold">{filteredRespondents.length}</span> of{' '}
            <span className="font-bold">{respondents.length}</span> respondents
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
