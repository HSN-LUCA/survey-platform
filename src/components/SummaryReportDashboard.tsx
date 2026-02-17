'use client';

import { useTranslation } from 'react-i18next';

interface Question {
  id: string;
  type: string;
  content_en: string;
  content_ar: string;
  category?: string;
}

interface Response {
  id: string;
  answers: Array<{
    question_id: string;
    value: string;
  }>;
}

interface SummaryReportDashboardProps {
  questions: Question[];
  responses: Response[];
  isRTL: boolean;
}

export default function SummaryReportDashboard({
  questions,
  responses,
  isRTL,
}: SummaryReportDashboardProps) {
  const { t } = useTranslation();

  // Group questions by category
  const groupedQuestions: Record<string, Question[]> = {};
  questions.forEach((q) => {
    const category = q.category || 'General';
    if (!groupedQuestions[category]) {
      groupedQuestions[category] = [];
    }
    groupedQuestions[category].push(q);
  });

  const calculateSatisfaction = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return { score: 0, label: '', color: '' };

    let totalScore = 0;
    let count = 0;

    responses.forEach((response) => {
      const answer = response.answers?.find((a) => a.question_id === questionId);
      if (!answer) return;

      if (question.type === 'star_rating') {
        const starValue = Number(answer.value);
        const percentage = (starValue / 5) * 100;
        totalScore += percentage;
        count++;
      } else if (question.type === 'percentage_range') {
        const percentage = Number(answer.value);
        totalScore += percentage;
        count++;
      }
    });

    if (count === 0) return { score: 0, label: '', color: '' };

    const avgScore = Math.round(totalScore / count);

    let label = '';
    let color = '';

    if (avgScore >= 80) {
      label = t('survey.verySatisfied');
      color = 'text-green-600';
    } else if (avgScore >= 60) {
      label = t('survey.satisfied');
      color = 'text-blue-600';
    } else if (avgScore >= 40) {
      label = t('survey.neutral');
      color = 'text-yellow-600';
    } else if (avgScore >= 20) {
      label = t('survey.dissatisfied');
      color = 'text-orange-600';
    } else {
      label = t('survey.veryDissatisfied');
      color = 'text-red-600';
    }

    return { score: avgScore, label, color };
  };

  const getSatisfactionBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    if (score >= 20) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
        <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Category Header */}
          <div className="bg-orange-500 text-white px-6 py-3 font-semibold text-center">
            {category}
          </div>

          {/* Questions Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryQuestions.map((question) => {
              const satisfaction = calculateSatisfaction(question.id);
              const isRatable =
                question.type === 'star_rating' || question.type === 'percentage_range';

              if (!isRatable) return null;

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-lg p-4 ${getSatisfactionBgColor(satisfaction.score)}`}
                >
                  {/* Question Title */}
                  <h3 className="text-sm font-semibold text-gray-800 mb-4 line-clamp-2">
                    {isRTL ? question.content_ar : question.content_en}
                  </h3>

                  {/* Satisfaction Gauge */}
                  <div className="mb-4">
                    <div className="relative w-32 h-32 mx-auto">
                      {/* Gauge Arc Background */}
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 120 120"
                        style={{ transform: 'rotate(-90deg)' }}
                      >
                        {/* Background arc */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        {/* Progress arc */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke={
                            satisfaction.score >= 80
                              ? '#16a34a'
                              : satisfaction.score >= 60
                                ? '#2563eb'
                                : satisfaction.score >= 40
                                  ? '#eab308'
                                  : satisfaction.score >= 20
                                    ? '#ea580c'
                                    : '#dc2626'
                          }
                          strokeWidth="8"
                          strokeDasharray={`${(satisfaction.score / 100) * 314} 314`}
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Center Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-bold ${satisfaction.color}`}>
                          {satisfaction.score}%
                        </span>
                        <span className="text-xs text-gray-600 text-center mt-1">
                          {satisfaction.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Response Count */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">{t('admin.totalResponses')}</p>
                    <p className="text-lg font-bold text-gray-800">
                      {
                        responses.filter((r) =>
                          r.answers?.some((a) => a.question_id === question.id)
                        ).length
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
