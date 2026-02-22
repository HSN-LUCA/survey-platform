'use client';

import { useTranslation } from 'react-i18next';

interface Answer {
  question_id: string;
  value: string;
}

interface Response {
  id: string;
  answers: Answer[];
}

interface Option {
  id: string;
  text_en: string;
  text_ar: string;
}

interface QuestionAnswerDistributionProps {
  questionId: string;
  questionType: string;
  questionContent_en: string;
  questionContent_ar: string;
  responses: Response[];
  options?: Option[];
  isRTL: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function QuestionAnswerDistribution({
  questionId,
  questionType,
  questionContent_en,
  questionContent_ar,
  responses,
  options,
  isRTL,
}: QuestionAnswerDistributionProps) {
  const { t } = useTranslation();

  // Calculate answer distribution
  const calculateDistribution = () => {
    const distribution: Record<string, number> = {};
    let totalAnswers = 0;

    responses.forEach((response) => {
      const answer = response.answers?.find((a) => a.question_id === questionId);
      if (answer) {
        distribution[answer.value] = (distribution[answer.value] || 0) + 1;
        totalAnswers++;
      }
    });

    return { distribution, totalAnswers };
  };

  const { distribution, totalAnswers } = calculateDistribution();

  if (totalAnswers === 0) {
    return null;
  }

  // Get labels for answers
  const getAnswerLabel = (value: string) => {
    if (questionType === 'multiple_choice' && options) {
      const option = options.find((o) => o.id === value);
      return isRTL ? option?.text_ar : option?.text_en;
    }
    return value;
  };

  // Get color based on question type and value
  const getColorForValue = (value: string, type: string) => {
    if (type === 'star_rating') {
      const starValue = Number(value);
      switch (starValue) {
        case 5:
          return '#10b981'; // emerald - Very Satisfied
        case 4:
          return '#22c55e'; // green - Satisfied
        case 3:
          return '#facc15'; // yellow - Neutral
        case 2:
          return '#f97316'; // orange - Dissatisfied
        case 1:
          return '#ef4444'; // red - Very Dissatisfied
        default:
          return '#3b82f6';
      }
    }
    return COLORS[Object.keys(distribution).indexOf(value) % COLORS.length];
  };
  const distributionArray = Object.entries(distribution)
    .map(([value, count]) => ({
      value,
      count,
      percentage: Math.round((count / totalAnswers) * 100),
      label: getAnswerLabel(value),
      color: getColorForValue(value, questionType),
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate pie chart segments
  let currentAngle = 0;
  const segments = distributionArray.map((item) => {
    const sliceAngle = (item.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 60 + 50 * Math.cos(startRad);
    const y1 = 60 + 50 * Math.sin(startRad);
    const x2 = 60 + 50 * Math.cos(endRad);
    const y2 = 60 + 50 * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M 60 60`,
      `L ${x1} ${y1}`,
      `A 50 50 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return {
      ...item,
      pathData,
    };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        {isRTL ? questionContent_ar : questionContent_en}
      </h4>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <svg className="w-64 h-64" viewBox="0 0 120 120">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* Legend and Stats */}
        <div className="flex-1">
          <div className="space-y-3">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{segment.label}</p>
                    <p className="text-xs text-gray-600">
                      {segment.count} {t('admin.responses') || 'responses'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">{segment.percentage}%</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">{t('admin.totalResponses') || 'Total Responses'}</p>
            <p className="text-2xl font-bold text-gray-800">{totalAnswers}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
