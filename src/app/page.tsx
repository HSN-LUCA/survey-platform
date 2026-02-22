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
  const [showQRModal, setShowQRModal] = useState<string | null>(null);

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
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">
                        {isRTL ? survey.title_ar : survey.title_en}
                      </h3>
                    </div>
                    <div className="flex gap-2 ml-4">
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
                            navigator.clipboard.writeText(url);
                            alert(isRTL ? 'تم نسخ الرابط' : 'Link copied to clipboard');
                          }
                        }}
                        title={isRTL ? 'شارك' : 'Share'}
                        className="p-2 bg-yellow-500 hover:bg-yellow-400 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.15c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.44 9.31 6.77 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.77 0 1.44-.3 1.96-.77l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                        </svg>
                      </button>

                      {/* QR Code Button */}
                      <button
                        onClick={() => setShowQRModal(survey.id)}
                        title={isRTL ? 'رمز QR' : 'QR Code'}
                        className="p-2 bg-yellow-500 hover:bg-yellow-400 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 relative">
                  {/* Description */}
                  <p className="text-gray-700 mb-6 line-clamp-3 text-sm leading-relaxed">
                    {isRTL ? survey.description_ar : survey.description_en}
                  </p>

                  {/* Kaaba Image */}
                  <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg">
                    <img
                      src="/kaaba.svg"
                      alt="Kaaba"
                      className="w-32 h-32 object-contain"
                    />
                  </div>

                  {/* Start Button */}
                  <Link
                    href={`/survey/${survey.id}`}
                    className="block w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-center"
                  >
                    {isRTL ? 'ابدأ الاستبيان' : 'Start Survey'}
                  </Link>
                </div>

                {/* QR Code Modal */}
                {showQRModal === survey.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          {isRTL ? 'رمز QR' : 'QR Code'}
                        </h3>
                        <button
                          onClick={() => setShowQRModal(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex justify-center mb-4 p-4 bg-gray-50 rounded-lg">
                        <QRCode
                          value={getSurveyUrl(survey.id)}
                          size={200}
                          level="H"
                          includeMargin={true}
                          fgColor="#000000"
                          bgColor="#ffffff"
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center mb-4">
                        {isRTL
                          ? 'امسح رمز QR للبدء'
                          : 'Scan QR code to start'}
                      </p>
                      <button
                        onClick={() => setShowQRModal(null)}
                        className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        {isRTL ? 'إغلاق' : 'Close'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
