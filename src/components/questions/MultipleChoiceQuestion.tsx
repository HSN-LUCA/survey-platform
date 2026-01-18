'use client';

import { Question } from '@/types';

interface MultipleChoiceQuestionProps {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  isRTL: boolean;
}

export default function MultipleChoiceQuestion({
  question,
  value,
  onChange,
  isRTL,
}: MultipleChoiceQuestionProps) {
  return (
    <div className="space-y-3">
      {question.options?.map((option) => (
        <label
          key={option.id}
          className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <input
            type="radio"
            name={question.id}
            value={option.id}
            checked={value === option.id}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-yellow-600 cursor-pointer"
          />
          <span className={`ml-3 text-gray-700 ${isRTL ? 'mr-3 ml-0' : ''}`}>
            {isRTL ? option.text_ar : option.text_en}
          </span>
        </label>
      ))}
    </div>
  );
}
