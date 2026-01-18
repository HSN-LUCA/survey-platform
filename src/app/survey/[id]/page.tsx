'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SurveyPage from '@/components/SurveyPage';
import i18n from '@/i18n/config';

export default function SurveyPageRoute() {
  const params = useParams();
  const [surveyId, setSurveyId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize i18n on client side
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  useEffect(() => {
    if (params?.id) {
      setSurveyId(params.id as string);
    }
  }, [params]);

  if (!surveyId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <SurveyPage surveyId={surveyId} />;
}
