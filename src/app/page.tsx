'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LanguageSelectionModal from '@/components/LanguageSelectionModal';

interface Question {
  id: string;
  category_en: string | null;
  category_ar: string | null;
}

interface Survey {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  customer_type: string;
  questions?: Question[];
}

export default function Home() {
  const { i18n } = useTranslation();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languageSelected, setLanguageSelected] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Check if language was already selected
    const hasSelected = localStorage.getItem('languageSelected');
    if (hasSelected) {
      setLanguageSelected(true);
    }
  }, []);

  useEffect(() => {
    if (languageSelected) {
      fetchSurveys();
    }
  }, [languageSelected]);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/surveys/public');

      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }

      const data = await response.json();
      setSurveys(data);
    } catch (err) {
      console.error('Error fetching surveys:', err);
      setError('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  const getSurveyUrl = (surveyId: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/survey/${surveyId}`;
    }
    return `/survey/${surveyId}`;
  };

  if (!languageSelected) {
    return (
      <LanguageSelectionModal
        onLanguageSelected={() => setLanguageSelected(true)}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📋</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isRTL ? 'منصة الاستبيانات' : 'Survey Platform'}
              </h1>
              <p className="text-sm text-gray-600">
                {isRTL ? 'استبيانات آمنة وموثوقة' : 'Secure & Reliable Surveys'}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isRTL ? 'الاستبيانات المتاحة' : 'Available Surveys'}
          </h2>
          <p className="text-lg text-gray-600">
            {isRTL
              ? 'اختر استبيانًا وابدأ الإجابة على الأسئلة'
              : 'Select a survey and start answering questions'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isRTL ? 'جاري التحميل...' : 'Loading surveys...'}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchSurveys}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {isRTL ? 'حاول مرة أخرى' : 'Try Again'}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && surveys.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              {isRTL
                ? 'لا توجد استبيانات متاحة حاليًا'
                : 'No surveys available at the moment'}
            </p>
          </div>
        )}

        {/* Surveys Grid */}
        {!loading && !error && surveys.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
              >
                {/* Card Header with Icon */}
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">
                      {isRTL ? survey.title_ar : survey.title_en}
                    </h3>
                    <span className="text-2xl">📋</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Description */}
                  <p className="text-gray-700 mb-6 line-clamp-3 text-sm leading-relaxed">
                    {isRTL ? survey.description_ar : survey.description_en}
                  </p>

                  {/* Kaaba Image */}
                  <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg">
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Crect x='50' y='60' width='100' height='100' fill='%23000' stroke='%23d4af37' stroke-width='3'/%3E%3Crect x='60' y='70' width='80' height='80' fill='%23111'/%3E%3Ccircle cx='100' cy='100' r='30' fill='%23d4af37' opacity='0.3'/%3E%3Cpath d='M 70 140 L 100 160 L 130 140' fill='%23d4af37'/%3E%3C/svg%3E"
                      alt="Kaaba"
                      className="w-24 h-24 object-contain"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Start Button */}
                    <Link
                      href={`/survey/${survey.id}`}
                      className="block w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-center"
                    >
                      {isRTL ? 'ابدأ الاستبيان' : 'Start Survey'}
                    </Link>

                    {/* Share Button */}
                    <button
                      onClick={() => {
                        const url = getSurveyUrl(survey.id);
                        if (navigator.share) {
                          navigator.share({
                            title: isRTL ? survey.title_ar : survey.title_en,
                            text: isRTL ? 'شارك هذا الاستبيان' : 'Share this survey',
                            url: url,
                          });
                        } else {
                          // Fallback: copy to clipboard
                          navigator.clipboard.writeText(url);
                          alert(isRTL ? 'تم نسخ الرابط' : 'Link copied to clipboard');
                        }
                      }}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
                    >
                      {isRTL ? 'شارك' : 'Share'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
