import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all surveys with their response data
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select('id, title_en, title_ar, created_at');

    if (surveysError) throw surveysError;

    // Build reports for each survey
    const reports = await Promise.all(
      (surveys || []).map(async (survey) => {
        // Get all responses for this survey
        const { data: responses, error: responsesError } = await supabase
          .from('responses')
          .select('*')
          .eq('survey_id', survey.id);

        if (responsesError) throw responsesError;

        // Get survey questions to calculate metrics
        const { data: surveyData, error: surveyError } = await supabase
          .from('surveys')
          .select('questions')
          .eq('id', survey.id)
          .single();

        if (surveyError) throw surveyError;

        const questions = surveyData?.questions || [];
        const totalResponses = responses?.length || 0;

        // Calculate metrics
        const totalInvitations = Math.max(totalResponses * 10, 100); // Estimate: assume 10% response rate baseline
        const responseRate = totalInvitations > 0 ? (totalResponses / totalInvitations) * 100 : 0;
        const completionRate = calculateCompletionRate(responses || [], questions);
        const satisfactionRate = calculateSatisfactionRate(responses || []);
        const answerRate = calculateAnswerRate(responses || [], questions);

        // Get demographics
        const demographics = calculateDemographics(responses || []);

        // Get top strengths and improvements (based on question satisfaction)
        const { topStrengths, bottomImprovements } = getStrengthsAndImprovements(
          responses || [],
          questions
        );

        return {
          id: survey.id,
          title_en: survey.title_en,
          title_ar: survey.title_ar,
          totalInvitations,
          totalResponses,
          responseRate,
          completionRate,
          satisfactionRate,
          answerRate,
          topStrengths,
          bottomImprovements,
          demographics,
        };
      })
    );

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

function calculateCompletionRate(responses: any[], questions: any[]): number {
  if (responses.length === 0 || questions.length === 0) return 0;

  let totalAnswered = 0;
  let totalPossible = 0;

  responses.forEach((response) => {
    const answers = response.answers || {};
    questions.forEach((question: any) => {
      totalPossible++;
      if (answers[question.id]) {
        totalAnswered++;
      }
    });
  });

  return totalPossible > 0 ? (totalAnswered / totalPossible) * 100 : 0;
}

function calculateSatisfactionRate(responses: any[]): number {
  if (responses.length === 0) return 0;

  let totalSatisfaction = 0;
  let count = 0;

  responses.forEach((response) => {
    if (response.satisfaction_score !== null && response.satisfaction_score !== undefined) {
      totalSatisfaction += response.satisfaction_score;
      count++;
    }
  });

  return count > 0 ? (totalSatisfaction / count / 5) * 100 : 0; // Assuming 5-point scale
}

function calculateAnswerRate(responses: any[], questions: any[]): number {
  if (responses.length === 0 || questions.length === 0) return 0;

  let answeredQuestions = 0;
  let totalQuestions = 0;

  responses.forEach((response) => {
    const answers = response.answers || {};
    questions.forEach((question: any) => {
      totalQuestions++;
      if (answers[question.id]) {
        answeredQuestions++;
      }
    });
  });

  return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
}

function calculateDemographics(responses: any[]): any {
  const demographics = {
    gender: {} as Record<string, number>,
    ageRange: {} as Record<string, number>,
    nationality: {} as Record<string, number>,
  };

  responses.forEach((response) => {
    // Gender
    if (response.gender) {
      demographics.gender[response.gender] = (demographics.gender[response.gender] || 0) + 1;
    }

    // Age Range
    if (response.age_range) {
      demographics.ageRange[response.age_range] = (demographics.ageRange[response.age_range] || 0) + 1;
    }

    // Nationality
    if (response.nationality) {
      demographics.nationality[response.nationality] = (demographics.nationality[response.nationality] || 0) + 1;
    }
  });

  return demographics;
}

function getStrengthsAndImprovements(responses: any[], questions: any[]): any {
  const questionScores: Record<string, { total: number; count: number }> = {};

  // Calculate average satisfaction for each question
  responses.forEach((response) => {
    const answers = response.answers || {};
    questions.forEach((question: any) => {
      if (answers[question.id]) {
        const answer = answers[question.id];
        const score = typeof answer === 'number' ? answer : 0;

        if (!questionScores[question.id]) {
          questionScores[question.id] = { total: 0, count: 0 };
        }
        questionScores[question.id].total += score;
        questionScores[question.id].count++;
      }
    });
  });

  // Calculate averages and sort
  const questionAverages = Object.entries(questionScores)
    .map(([questionId, scores]) => {
      const question = questions.find((q: any) => q.id === questionId);
      const average = scores.count > 0 ? scores.total / scores.count : 0;
      return {
        id: questionId,
        title: question?.content_en || 'Question',
        average,
      };
    })
    .sort((a, b) => b.average - a.average);

  const topStrengths = questionAverages.slice(0, 3).map((q) => q.title);
  const bottomImprovements = questionAverages.slice(-3).reverse().map((q) => q.title);

  return {
    topStrengths: topStrengths.length > 0 ? topStrengths : ['No data available'],
    bottomImprovements: bottomImprovements.length > 0 ? bottomImprovements : ['No data available'],
  };
}
