'use client';

import { useTranslation } from 'react-i18next';

interface SurveyProgressBarProps {
  categories: string[];
  currentCategoryIndex: number;
  isComplete: boolean;
}

export default function SurveyProgressBar({
  categories,
  currentCategoryIndex,
  isComplete,
}: SurveyProgressBarProps) {
  const { t } = useTranslation();
  const totalCategories = categories.length;
  const progressPercentage = isComplete
    ? 100
    : ((currentCategoryIndex + 1) / totalCategories) * 100;

  return (
    <div className="w-full mb-8">
      {/* Category Labels */}
      <div className="flex justify-between mb-4 gap-2">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`text-center flex-1 ${
              index <= currentCategoryIndex ? 'text-yellow-600' : 'text-gray-400'
            }`}
          >
            <div className="text-sm font-semibold truncate px-1">{category}</div>
            <div className="text-xs mt-1">
              {index < currentCategoryIndex && '✓'}
              {index === currentCategoryIndex && '●'}
              {index > currentCategoryIndex && '○'}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Line */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete ? 'bg-green-500' : 'bg-yellow-600'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Progress Text */}
      <div className="mt-3 text-center text-sm text-gray-600">
        {isComplete ? (
          <span className="text-green-600 font-semibold">✓ {t('common.success')}</span>
        ) : (
          <span>
            {categories[currentCategoryIndex]} ({currentCategoryIndex + 1} {t('common.of')} {totalCategories})
          </span>
        )}
      </div>
    </div>
  );
}
