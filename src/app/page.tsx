'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LanguageSelectionModal from '@/components/LanguageSelectionModal';
import QRCode from 'qrcode.react';

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

  const getFirstCategory = (survey: Survey): string | null => {
    if (!survey.questions || survey.questions.length === 0) {
      return null;
    }

    const categoryField = isRTL ? 'category_ar' : 'category_en';
    for (const question of survey.questions) {
      const category = question[categoryField as keyof Question];
      if (category && typeof category === 'string' && category.trim()) {
        return category;
      }
    }
    return null;
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

                  {/* Category */}
                  {getFirstCategory(survey) && (
                    <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium">
                        {isRTL ? 'الفئة: ' : 'Category: '}
                        <span className="font-semibold">{getFirstCategory(survey)}</span>
                      </p>
                    </div>
                  )}

                  {/* QR Code */}
                  <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg">
                    <QRCode
                      value={getSurveyUrl(survey.id)}
                      size={120}
                      level="H"
                      includeMargin={true}
                      fgColor="#000000"
                      bgColor="#ffffff"
                    />
                  </div>

                  {/* QR Code Description */}
                  <p className="text-xs text-gray-500 text-center mb-4">
                    {isRTL
                      ? 'امسح رمز QR للبدء'
                      : 'Scan QR code to start'}
                  </p>

                  {/* Start Button */}
                  <Link
                    href={`/survey/${survey.id}`}
                    className="block w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-center"
                  >
                    {isRTL ? 'ابدأ الاستبيان' : 'Start Survey'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
