'use client';

import { Question } from '@/types';

interface TextBoxQuestionProps {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string) => void;
  isRTL: boolean;
}

export default function TextBoxQuestion({
  question,
  value,
  onChange,
  isRTL,
}: TextBoxQuestionProps) {
  return (
    <div className="w-full">
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isRTL ? 'أدخل ملاحظاتك هنا...' : 'Enter your notes here...'}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 bg-white text-black font-medium transition-all resize-none"
        rows={5}
      />
      <p className="text-xs text-gray-500 mt-2">
        {isRTL ? 'يمكنك إدخال أي ملاحظات أو تعليقات إضافية' : 'You can enter any additional notes or comments'}
      </p>
    </div>
  );
}
