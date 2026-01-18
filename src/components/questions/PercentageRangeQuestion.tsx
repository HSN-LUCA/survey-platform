'use client';

import { Question } from '@/types';

interface PercentageRangeQuestionProps {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  isRTL: boolean;
}

export default function PercentageRangeQuestion({
  question,
  value,
  onChange,
  isRTL,
}: PercentageRangeQuestionProps) {
  const min = question.percentage_config?.min || 0;
  const max = question.percentage_config?.max || 100;
  const step = question.percentage_config?.step || 5;
  const currentValue = value ? parseInt(String(value)) : min;

  return (
    <div className="space-y-4">
      {/* Slider */}
      <div className="px-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
        />
      </div>

      {/* Value Display */}
      <div className="text-center">
        <div className="text-4xl font-bold text-yellow-600">{currentValue}%</div>
        <p className="text-sm text-gray-600 mt-2">
          {isRTL ? 'النطاق' : 'Range'}: {min}% - {max}%
        </p>
      </div>

      {/* Value Labels */}
      <div className="flex justify-between text-xs text-gray-500 px-2">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>

      {/* Percentage Indicators */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-5 gap-2">
          {[0, 25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              type="button"
              onClick={() => onChange(percent)}
              className={`py-2 px-1 rounded text-sm font-medium transition-colors ${
                currentValue === percent
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-yellow-600'
              }`}
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
