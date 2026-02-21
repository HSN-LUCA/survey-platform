'use client';

import { useTranslation } from 'react-i18next';
import QuestionAnswerDistribution from './QuestionAnswerDistribution';

interface Question {
  id: string;
  type: string;
  content_en: string;
  content_ar: string;
  category?: string;
  options?: Array<{
    id: string;
    text_en: string;
    text_ar: string;
    order_num: number;
  }>;
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
  totalResponses?: number;
}

export default function SummaryReportDashboard({
  questions,
  responses,
  isRTL,
  totalResponses,
}: SummaryReportDashboardProps) {
  const { t } = useTranslation();

  // Calculate answer rate
  const calculateAnswerRate = () => {
    if (responses.length === 0) return { answered: 0, notAnswered: 0, percentage: 0 };
    
    const answered = responses.length;
    const notAnswered = (totalResponses || 0) - answered;
    const percentage = totalResponses ? Math.round((answered / totalResponses) * 100) : 100;
    
    return { answered, notAnswered, percentage };
  };

  const answerRate = calculateAnswerRate();

  // Calculate overall survey satisfaction (Top 2 Box Method)
  // Formula: (Count of Satisfied Responses / Total Rating Responses) × 100
  // Satisfied = ratings 4 & 5 on 5-point scale, or >= 80% on percentage scale
  const calculateOverallSatisfaction = () => {
    if (responses.length === 0) return { score: 0, label: '', color: '', satisfiedCount: 0, totalCount: 0 };

    let satisfiedCount = 0;
    let totalRatingResponses = 0;

    // Count all rating answers across all responses
    responses.forEach((response) => {
      response.answers?.forEach((answer) => {
        const question = questions.find((q) => q.id === answer.question_id);
        if (!question) return;

        // Only count star_rating and percentage_range questions
        if (question.type === 'star_rating') {
          const starValue = Number(answer.value);
          // Satisfied = 4 or 5 stars (top 2 box)
          if (starValue >= 4) {
            satisfiedCount++;
          }
          totalRatingResponses++;
        } else if (question.type === 'percentage_range') {
          const percentage = Number(answer.value);
          // Satisfied = >= 80% (equivalent to 4-5 on 5-point scale)
          if (percentage >= 80) {
            satisfiedCount++;
          }
          totalRatingResponses++;
        }
      });
    });

    if (totalRatingResponses === 0) return { score: 0, label: '', color: '', satisfiedCount: 0, totalCount: 0 };

    // Calculate overall satisfaction percentage using Top 2 Box method
    const overallScore = Math.round((satisfiedCount / totalRatingResponses) * 100);

    let label = '';
    let color = '';

    if (overallScore >= 80) {
      label = t('survey.verySatisfied');
      color = 'text-green-600';
    } else if (overallScore >= 60) {
      label = t('survey.satisfied');
      color = 'text-blue-600';
    } else if (overallScore >= 40) {
      label = t('survey.neutral');
      color = 'text-yellow-600';
    } else if (overallScore >= 20) {
      label = t('survey.dissatisfied');
      color = 'text-orange-600';
    } else {
      label = t('survey.veryDissatisfied');
      color = 'text-red-600';
    }

    return { score: overallScore, label, color, satisfiedCount, totalCount: totalRatingResponses };
  };

  const overallSatisfaction = calculateOverallSatisfaction();

  // Group questions by category
  const groupedQuestions: Record<string, Question[]> = {};
  questions.forEach((q) => {
    const category = q.category || 'General';
    if (!groupedQuestions[category]) {
      groupedQuestions[category] = [];
    }
    groupedQuestions[category].push(q);
  });



  return (
    <div className="space-y-8">
      {/* Answer Rate Pie Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{t('admin.answerRate')}</h3>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Pie Chart */}
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="20" />
              
              {/* Answered segment */}
              {answerRate.answered > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray={`${(answerRate.percentage / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              )}
            </svg>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-green-600">{answerRate.percentage}%</span>
              <span className="text-xs text-gray-600 mt-1">{t('admin.answered')}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <div>
                <p className="text-sm text-gray-600">{t('admin.answered')}</p>
                <p className="text-lg font-bold text-gray-800">{answerRate.answered}</p>
              </div>
            </div>
            
            {answerRate.notAnswered > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div>
                  <p className="text-sm text-gray-600">{t('admin.notAnswered')}</p>
                  <p className="text-lg font-bold text-gray-800">{answerRate.notAnswered}</p>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">{t('admin.totalSurveys')}</p>
              <p className="text-lg font-bold text-gray-800">{totalResponses || responses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Survey Satisfaction - Google Forms Style */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">
          {t('admin.overallSatisfaction')}
        </h3>
        
        {overallSatisfaction.totalCount === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {t('admin.noSatisfactionData')}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Main Score Display */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Large Score Circle */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    {overallSatisfaction.score > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke={
                          overallSatisfaction.score >= 80
                            ? '#16a34a'
                            : overallSatisfaction.score >= 60
                              ? '#2563eb'
                              : overallSatisfaction.score >= 40
                                ? '#eab308'
                                : overallSatisfaction.score >= 20
                                  ? '#ea580c'
                                  : '#dc2626'
                        }
                        strokeWidth="8"
                        strokeDasharray={`${(overallSatisfaction.score / 100) * 314} 314`}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-bold ${overallSatisfaction.color}`}>
                      {overallSatisfaction.score}%
                    </span>
                    <span className="text-xs text-gray-600 mt-1">{t('admin.satisfiedResponses')}</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex-1 space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('admin.satisfiedResponses')}</p>
                  <p className="text-3xl font-bold text-green-600">{overallSatisfaction.satisfiedCount}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {t('admin.totalResponses')}: {overallSatisfaction.totalCount}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('admin.satisfactionLevel')}</p>
                  <p className="text-2xl font-bold text-blue-600">{overallSatisfaction.label}</p>
                </div>
              </div>
            </div>

            {/* Satisfaction Distribution Bar - Google Forms Style */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-6">
                {t('admin.satisfactionDistribution')}
              </h4>
              
              <div className="space-y-5">
                {/* Very Satisfied (5 stars / 100%) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 w-32">
                      {t('survey.verySatisfied')} (5)
                    </span>
                    <span className="text-sm font-bold text-gray-800 w-12 text-right">
                      {Math.round(
                        (responses.reduce((count, response) => {
                          return count + (response.answers?.filter(a => {
                            const q = questions.find(q => q.id === a.question_id);
                            return q?.type === 'star_rating' && Number(a.value) === 5;
                          }).length || 0);
                        }, 0) / overallSatisfaction.totalCount) * 100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-lg h-8">
                    <div
                      className="bg-green-500 h-8 rounded-lg transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (responses.reduce((count, response) => {
                            return count + (response.answers?.filter(a => {
                              const q = questions.find(q => q.id === a.question_id);
                              return q?.type === 'star_rating' && Number(a.value) === 5;
                            }).length || 0);
                          }, 0) / overallSatisfaction.totalCount) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Satisfied (4 stars / 80-99%) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 w-32">
                      {t('survey.satisfied')} (4)
                    </span>
                    <span className="text-sm font-bold text-gray-800 w-12 text-right">
                      {Math.round(
                        (responses.reduce((count, response) => {
                          return count + (response.answers?.filter(a => {
                            const q = questions.find(q => q.id === a.question_id);
                            return q?.type === 'star_rating' && Number(a.value) === 4;
                          }).length || 0);
                        }, 0) / overallSatisfaction.totalCount) * 100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-lg h-8">
                    <div
                      className="bg-blue-500 h-8 rounded-lg transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (responses.reduce((count, response) => {
                            return count + (response.answers?.filter(a => {
                              const q = questions.find(q => q.id === a.question_id);
                              return q?.type === 'star_rating' && Number(a.value) === 4;
                            }).length || 0);
                          }, 0) / overallSatisfaction.totalCount) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Neutral (3 stars / 60-79%) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 w-32">
                      {t('survey.neutral')} (3)
                    </span>
                    <span className="text-sm font-bold text-gray-800 w-12 text-right">
                      {Math.round(
                        (responses.reduce((count, response) => {
                          return count + (response.answers?.filter(a => {
                            const q = questions.find(q => q.id === a.question_id);
                            return q?.type === 'star_rating' && Number(a.value) === 3;
                          }).length || 0);
                        }, 0) / overallSatisfaction.totalCount) * 100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-lg h-8">
                    <div
                      className="bg-yellow-500 h-8 rounded-lg transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (responses.reduce((count, response) => {
                            return count + (response.answers?.filter(a => {
                              const q = questions.find(q => q.id === a.question_id);
                              return q?.type === 'star_rating' && Number(a.value) === 3;
                            }).length || 0);
                          }, 0) / overallSatisfaction.totalCount) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Dissatisfied (2 stars / 40-59%) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 w-32">
                      {t('survey.dissatisfied')} (2)
                    </span>
                    <span className="text-sm font-bold text-gray-800 w-12 text-right">
                      {Math.round(
                        (responses.reduce((count, response) => {
                          return count + (response.answers?.filter(a => {
                            const q = questions.find(q => q.id === a.question_id);
                            return q?.type === 'star_rating' && Number(a.value) === 2;
                          }).length || 0);
                        }, 0) / overallSatisfaction.totalCount) * 100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-lg h-8">
                    <div
                      className="bg-orange-500 h-8 rounded-lg transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (responses.reduce((count, response) => {
                            return count + (response.answers?.filter(a => {
                              const q = questions.find(q => q.id === a.question_id);
                              return q?.type === 'star_rating' && Number(a.value) === 2;
                            }).length || 0);
                          }, 0) / overallSatisfaction.totalCount) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Very Dissatisfied (1 star / 0-39%) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 w-32">
                      {t('survey.veryDissatisfied')} (1)
                    </span>
                    <span className="text-sm font-bold text-gray-800 w-12 text-right">
                      {Math.round(
                        (responses.reduce((count, response) => {
                          return count + (response.answers?.filter(a => {
                            const q = questions.find(q => q.id === a.question_id);
                            return q?.type === 'star_rating' && Number(a.value) === 1;
                          }).length || 0);
                        }, 0) / overallSatisfaction.totalCount) * 100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-lg h-8">
                    <div
                      className="bg-red-500 h-8 rounded-lg transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (responses.reduce((count, response) => {
                            return count + (response.answers?.filter(a => {
                              const q = questions.find(q => q.id === a.question_id);
                              return q?.type === 'star_rating' && Number(a.value) === 1;
                            }).length || 0);
                          }, 0) / overallSatisfaction.totalCount) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions by Category (Option 1) */}
      {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
        <div key={category}>
          {/* Category Header */}
          <div className="bg-orange-500 text-white px-6 py-3 font-semibold text-center rounded-t-lg mb-6">
            {category}
          </div>

          {/* Answer Distribution for each question */}
          <div className="space-y-6">
            {categoryQuestions.map((question) => (
              <QuestionAnswerDistribution
                key={question.id}
                questionId={question.id}
                questionType={question.type}
                questionContent_en={question.content_en}
                questionContent_ar={question.content_ar}
                responses={responses}
                options={question.options}
                isRTL={isRTL}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
