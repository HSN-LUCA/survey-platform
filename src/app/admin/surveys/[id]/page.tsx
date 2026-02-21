'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/AdminLayout';
import SummaryReportDashboard from '@/components/SummaryReportDashboard';

interface Question {
  id: string;
  type: string;
  content_en: string;
  content_ar: string;
  required: boolean;
  order_num: number;
  options?: Array<{
    id: string;
    text_en: string;
    text_ar: string;
    order_num: number;
  }>;
}

interface Answer {
  id: string;
  question_id: string;
  value: string;
}

interface Response {
  id: string;
  survey_id: string;
  user_session_id: string;
  submitted_at: string;
  answers: Answer[];
}

interface Survey {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  customer_type: string;
  created_at: string;
  questions: Question[];
}

export default function SurveyDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'responses' | 'summary'>('details');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cloning, setCloning] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchSurveyAndResponses();
  }, [surveyId]);

  const fetchSurveyAndResponses = async () => {
    try {
      setLoading(true);
      setError(null);

      const storedToken = localStorage.getItem('adminToken');
      if (!storedToken) {
        router.push('/admin/login');
        return;
      }

      setToken(storedToken);

      // Fetch survey details
      const surveyResponse = await fetch(`/api/surveys/${surveyId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!surveyResponse.ok) {
        if (surveyResponse.status === 404) {
          setError(t('survey.surveyNotFound'));
        } else {
          setError(t('errors.serverError'));
        }
        return;
      }

      const surveyData = await surveyResponse.json();
      setSurvey(surveyData);

      // Fetch responses
      const responsesResponse = await fetch(`/api/responses?survey_id=${surveyId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (responsesResponse.ok) {
        const responsesData = await responsesResponse.json();
        setResponses(responsesData.responses || []);
      }
    } catch (err) {
      console.error('Error fetching survey:', err);
      setError(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const getQuestionById = (questionId: string) => {
    return survey?.questions?.find((q) => q.id === questionId);
  };

  const deleteResponse = async (responseId: string) => {
    if (!window.confirm(t('admin.confirmDeleteResponse'))) {
      return;
    }

    try {
      setDeletingId(responseId);
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete response');
      }

      setResponses((prev) => prev.filter((r) => r.id !== responseId));
    } catch (err) {
      console.error('Error deleting response:', err);
      setError(t('errors.serverError'));
    } finally {
      setDeletingId(null);
    }
  };

  const getAnswerText = (answer: Answer) => {
    const question = getQuestionById(answer.question_id);
    if (!question) return answer.value;

    if (question.type === 'multiple_choice') {
      const option = question.options?.find((o) => o.id === answer.value);
      return isRTL ? option?.text_ar : option?.text_en;
    }

    return answer.value;
  };

  const cloneSurvey = async () => {
    try {
      setCloning(true);
      const response = await fetch(`/api/surveys/${surveyId}/clone`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clone survey');
      }

      const clonedSurvey = await response.json();
      alert(t('admin.cloneSurveySuccess'));
      router.push(`/admin/surveys/${clonedSurvey.id}`);
    } catch (err) {
      console.error('Error cloning survey:', err);
      alert(t('errors.serverError'));
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="surveys">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout activeTab="surveys">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('common.back')}
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!survey) {
    return null;
  }

  return (
    <AdminLayout activeTab="surveys">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 text-yellow-600 hover:text-yellow-700 font-medium"
          >
            ← {t('common.back')}
          </button>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {isRTL ? survey.title_ar : survey.title_en}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={cloneSurvey}
                  disabled={cloning}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {cloning ? t('common.loading') : t('admin.cloneSurvey')}
                </button>
                <Link
                  href={`/admin/surveys/${survey.id}/edit`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {t('admin.editSurvey')}
                </Link>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {isRTL ? survey.description_ar : survey.description_en}
            </p>

            <div className="flex gap-6 flex-wrap">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('survey.customerType')}:
                </span>
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {survey.customer_type === 'pilgrims'
                    ? t('survey.pilgrims')
                    : t('survey.staff')}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('common.created')}:
                </span>
                <span className="ml-2 text-gray-700">
                  {new Date(survey.created_at).toLocaleDateString(
                    isRTL ? 'ar-SA' : 'en-US'
                  )}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('admin.totalResponses')}:
                </span>
                <span className="ml-2 text-2xl font-bold text-yellow-600">
                  {responses.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t('admin.questions')}
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'summary'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t('admin.summaryReport')}
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'responses'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t('admin.totalResponses')} ({responses.length})
          </button>
        </div>

        {/* Questions Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t('admin.questions')} ({survey.questions?.length || 0})
            </h2>

            {survey.questions && survey.questions.length > 0 ? (
              <div className="space-y-6">
                {survey.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Q.{index + 1} {isRTL ? question.content_ar : question.content_en}
                        </h3>
                        <div className="flex gap-3 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {question.type.replace('_', ' ')}
                          </span>
                          {question.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              {t('common.required')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Options for multiple choice */}
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-300">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {t('admin.options')}:
                        </p>
                        <ul className="space-y-1">
                          {question.options.map((option) => (
                            <li key={option.id} className="text-gray-700">
                              • {isRTL ? option.text_ar : option.text_en}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Star rating info */}
                    {question.type === 'star_rating' && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-300">
                        <p className="text-sm text-gray-600">
                          {t('admin.starRating')} (1-5 stars)
                        </p>
                      </div>
                    )}

                    {/* Percentage range info */}
                    {question.type === 'percentage_range' && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-300">
                        <p className="text-sm text-gray-600">
                          {t('admin.percentageRange')} (0-100%)
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                {t('survey.noQuestions')}
              </p>
            )}
          </div>
        )}

        {/* Summary Report Tab */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t('admin.summaryReport')}
            </h2>

            {responses.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                {t('survey.noResponses') || 'No responses yet'}
              </p>
            ) : (
              <SummaryReportDashboard
                questions={survey.questions || []}
                responses={responses}
                isRTL={isRTL}
                totalResponses={responses.length}
              />
            )}
          </div>
        )}

        {/* Responses Tab */}
        {activeTab === 'responses' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t('admin.totalResponses')} ({responses.length})
            </h2>

            {responses.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                {t('survey.noResponses') || 'No responses yet'}
              </p>
            ) : (
              <div className="space-y-6">
                {responses.map((response, index) => (
                  <div
                    key={response.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Response #{index + 1}
                      </h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {new Date(response.submitted_at).toLocaleDateString(
                            isRTL ? 'ar-SA' : 'en-US'
                          )}{' '}
                          {new Date(response.submitted_at).toLocaleTimeString(
                            isRTL ? 'ar-SA' : 'en-US'
                          )}
                        </span>
                        <button
                          onClick={() => deleteResponse(response.id)}
                          disabled={deletingId === response.id}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-xs font-medium"
                        >
                          {deletingId === response.id ? t('common.loading') : t('admin.deleteResponse')}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {response.answers?.map((answer) => {
                        const question = getQuestionById(answer.question_id);
                        if (!question) return null;

                        return (
                          <div
                            key={answer.id}
                            className="border-l-4 border-yellow-300 pl-4 py-2"
                          >
                            <p className="text-sm font-medium text-gray-600 mb-1">
                              {isRTL ? question.content_ar : question.content_en}
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {getAnswerText(answer)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
