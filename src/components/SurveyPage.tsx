'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Survey, Question } from '@/types';
import QuestionRenderer from './QuestionRenderer';
import LanguageSwitcher from './LanguageSwitcher';
import UserDetailsForm, { UserDetails } from './UserDetailsForm';
import SurveyProgressBar from './SurveyProgressBar';

interface SurveyPageProps {
  surveyId: string;
}

interface QuestionWithCategory extends Question {
  category?: string;
}

export default function SurveyPage({ surveyId }: SurveyPageProps) {
  const { t, i18n } = useTranslation();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [groupedQuestions, setGroupedQuestions] = useState<Record<string, QuestionWithCategory[]>>({});

  useEffect(() => {
    fetchSurvey();
  }, [surveyId]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/surveys/public?id=${surveyId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError(t('survey.surveyNotFound'));
        } else {
          setError(t('errors.serverError'));
        }
        return;
      }

      const data = await response.json();
      setSurvey(data);

      // Group questions by category
      if (data.questions && data.questions.length > 0) {
        const grouped: Record<string, QuestionWithCategory[]> = {};
        const categoryList: string[] = [];

        data.questions.forEach((question: QuestionWithCategory) => {
          const category = question.category || 'General';
          if (!grouped[category]) {
            grouped[category] = [];
            categoryList.push(category);
          }
          grouped[category].push(question);
        });

        setGroupedQuestions(grouped);
        setCategories(categoryList);
      }
    } catch (err) {
      console.error('Error fetching survey:', err);
      setError(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // Clear validation error for this question
    setValidationErrors((prev) => prev.filter((id) => id !== questionId));

    // Update current category index based on answered questions
    if (survey && categories.length > 0) {
      for (let i = 0; i < categories.length; i++) {
        const categoryQuestions = groupedQuestions[categories[i]] || [];
        const allAnswered = categoryQuestions.every((q) => answers[q.id] !== undefined);
        if (!allAnswered) {
          setCurrentCategoryIndex(i);
          break;
        }
      }
    }
  };

  const validateAnswers = (): boolean => {
    const errors: string[] = [];

    if (!survey) return false;

    for (const question of survey.questions || []) {
      if (question.required && !answers[question.id]) {
        errors.push(question.id);
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAnswers()) {
      return;
    }

    try {
      setSubmitting(true);

      const submissionAnswers = Object.entries(answers).map(([questionId, value]) => ({
        question_id: questionId,
        value,
      }));

      console.log('Submitting survey with user details:', {
        survey_id: surveyId,
        responses: submissionAnswers,
        userDetails: userDetails,
      });

      const response = await fetch(`/api/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          survey_id: surveyId,
          responses: submissionAnswers,
          userDetails: userDetails,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', {
        contentType: response.headers.get('content-type'),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        responseData = { error: 'Failed to parse server response' };
      }

      console.log('Response data:', responseData);

      if (!response.ok) {
        console.error('Survey submission error:', {
          status: response.status,
          statusText: response.statusText,
          error: responseData?.error,
          fullResponse: responseData,
        });
        if (response.status === 409) {
          setError(t('validation.surveyAlreadySubmitted'));
        } else {
          const errorMsg = responseData?.error || response.statusText || t('errors.serverError');
          setError(errorMsg);
        }
        return;
      }

      console.log('Survey submitted successfully');
      setSubmitted(true);
      setAnswers({});
    } catch (err) {
      console.error('Error submitting survey:', err);
      const errorMessage = err instanceof Error ? err.message : t('errors.networkError');
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error && !submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('common.error')}</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LanguageSwitcher />
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">{t('common.success')}</h1>
          <p className="text-gray-700 mb-6">{t('survey.surveySubmitted')}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  if (!survey) {
    return null;
  }

  const isRTL = i18n.language === 'ar';

  // Show user details form first
  if (showUserDetailsForm) {
    return (
      <UserDetailsForm
        onSubmit={(details) => {
          setUserDetails(details);
          setShowUserDetailsForm(false);
        }}
        isRTL={isRTL}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 py-8 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <LanguageSwitcher />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Survey Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-yellow-900 mb-2">
              {isRTL ? survey.title_ar : survey.title_en}
            </h1>
            {(isRTL ? survey.description_ar : survey.description_en) && (
              <p className="text-gray-600">
                {isRTL ? survey.description_ar : survey.description_en}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {categories.length > 0 && (
            <SurveyProgressBar
              categories={categories}
              currentCategoryIndex={currentCategoryIndex}
              isComplete={false}
            />
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 font-medium mb-2">
                {t('validation.allQuestionsRequired')}
              </p>
            </div>
          )}

          {/* Survey Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {categories.length > 0 ? (
                categories.map((category, catIndex) => (
                  <div key={category} className="mb-12">
                    {/* Category Header with Visual Separator */}
                    <div className="mb-8 pb-6 border-b-4 border-yellow-600 bg-yellow-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-yellow-900 mb-2">
                            {category}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {t('survey.category')} {catIndex + 1} {t('common.of')} {categories.length}
                          </p>
                        </div>
                        <div className="text-4xl font-bold text-yellow-600 opacity-20">
                          {catIndex + 1}
                        </div>
                      </div>
                    </div>

                    {/* Questions in Category */}
                    <div className="space-y-8">
                      {groupedQuestions[category]?.map((question, qIndex) => (
                        <div
                          key={question.id}
                          className={`pb-6 border-b border-gray-200 last:border-b-0 ${
                            validationErrors.includes(question.id) ? 'bg-red-50 p-4 rounded' : ''
                          }`}
                        >
                          <div className="mb-4">
                            <label className="block">
                              <span className="text-yellow-900 font-semibold">
                                Q.{qIndex + 1}
                              </span>
                              <span className="text-yellow-900 font-semibold ml-2">
                                {isRTL ? question.content_ar : question.content_en}
                              </span>
                              {question.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                          </div>

                          <QuestionRenderer
                            question={question}
                            value={answers[question.id]}
                            onChange={(value) => handleAnswerChange(question.id, value)}
                            isRTL={isRTL}
                          />

                          {validationErrors.includes(question.id) && (
                            <p className="text-red-600 text-sm mt-2">
                              {t('validation.required')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback if no categories
                <div className="space-y-8">
                  {survey?.questions?.map((question, qIndex) => (
                    <div
                      key={question.id}
                      className={`pb-6 border-b border-gray-200 last:border-b-0 ${
                        validationErrors.includes(question.id) ? 'bg-red-50 p-4 rounded' : ''
                      }`}
                    >
                      <div className="mb-4">
                        <label className="block">
                          <span className="text-yellow-900 font-semibold">
                            Q.{qIndex + 1}
                          </span>
                          <span className="text-yellow-900 font-semibold ml-2">
                            {isRTL ? question.content_ar : question.content_en}
                          </span>
                          {question.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                      </div>

                      <QuestionRenderer
                        question={question}
                        value={answers[question.id]}
                        onChange={(value) => handleAnswerChange(question.id, value)}
                        isRTL={isRTL}
                      />

                      {validationErrors.includes(question.id) && (
                        <p className="text-red-600 text-sm mt-2">
                          {t('validation.required')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? t('common.loading') : t('survey.submitSurvey')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
