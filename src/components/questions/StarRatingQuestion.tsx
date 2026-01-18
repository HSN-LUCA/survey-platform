'use client';

import { useState } from 'react';
import { Question } from '@/types';

interface StarRatingQuestionProps {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  isRTL: boolean;
}

export default function StarRatingQuestion({
  question,
  value,
  onChange,
  isRTL,
}: StarRatingQuestionProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const starCount = question.star_config?.star_count || 5;
  const currentValue = value ? parseInt(String(value)) : 0;
  const displayValue = hoverValue || currentValue;

  const getRangeMapping = (stars: number) => {
    return question.star_config?.range_mappings?.find((m) => m.stars === stars);
  };

  return (
    <div className="space-y-4">
      {/* Star Rating Display */}
      <div className="flex gap-2 justify-center">
        {Array.from({ length: starCount }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayValue;

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHoverValue(starValue)}
              onMouseLeave={() => setHoverValue(null)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <span
                className={`text-4xl ${
                  isFilled ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Rating Display */}
      {displayValue > 0 && (
        <div className="text-center">
          <p className="text-lg font-semibold text-yellow-900">
            {displayValue} / {starCount}
          </p>

          {/* Range Mapping Display */}
          {getRangeMapping(displayValue) && (
            <p className="text-sm text-gray-600 mt-2">
              {getRangeMapping(displayValue)?.min_percentage}% -{' '}
              {getRangeMapping(displayValue)?.max_percentage}%
            </p>
          )}
        </div>
      )}

      {/* All Range Mappings */}
      {question.star_config?.range_mappings && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            {isRTL ? 'تعيين النطاق' : 'Range Mappings'}
          </p>
          <div className="space-y-1">
            {question.star_config.range_mappings.map((mapping) => (
              <div key={mapping.stars} className="text-sm text-gray-600">
                <span className="font-medium">{mapping.stars} ★:</span>{' '}
                {mapping.min_percentage}% - {mapping.max_percentage}%
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
