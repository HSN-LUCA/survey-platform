'use client';

import { Question } from '@/types';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import StarRatingQuestion from './questions/StarRatingQuestion';
import PercentageRangeQuestion from './questions/PercentageRangeQuestion';

interface QuestionRendererProps {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  isRTL: boolean;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  isRTL,
}: QuestionRendererProps) {
  switch (question.type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceQuestion
          question={question}
          value={value}
          onChange={onChange}
          isRTL={isRTL}
        />
      );

    case 'star_rating':
      return (
        <StarRatingQuestion
          question={question}
          value={value}
          onChange={onChange}
          isRTL={isRTL}
        />
      );

    case 'percentage_range':
      return (
        <PercentageRangeQuestion
          question={question}
          value={value}
          onChange={onChange}
          isRTL={isRTL}
        />
      );

    default:
      return <div>Unknown question type</div>;
  }
}
