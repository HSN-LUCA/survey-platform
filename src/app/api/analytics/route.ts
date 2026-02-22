import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

function verifyToken(token: string) {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production'
    );
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get date range from query parameters
    const searchParams = req.nextUrl.searchParams;
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    // Get all surveys
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select('id, title_en, title_ar, created_at');

    if (surveysError) {
      throw surveysError;
    }

    // Filter surveys by date range if provided
    let filteredSurveys = surveys || [];
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // Include entire day

      filteredSurveys = filteredSurveys.filter((survey) => {
        const surveyDate = new Date(survey.created_at);
        return surveyDate >= from && surveyDate <= to;
      });
    }

    // Get response counts and satisfaction scores for each survey
    const surveyStats = await Promise.all(
      filteredSurveys.map(async (survey) => {
        const { count, error } = await supabase
          .from('responses')
          .select('*', { count: 'exact', head: true })
          .eq('survey_id', survey.id);

        if (error) {
          console.error('Error fetching response count:', error);
          return {
            ...survey,
            response_count: 0,
            satisfaction_score: 0,
          };
        }

        // Get star rating questions for this survey
        const { data: questions } = await supabase
          .from('questions')
          .select('id')
          .eq('survey_id', survey.id)
          .eq('type', 'star_rating');

        let satisfactionScore = 0;
        if (questions && questions.length > 0) {
          // Get all answers for star rating questions
          const { data: answers } = await supabase
            .from('answers')
            .select('value')
            .in('question_id', questions.map(q => q.id));

          if (answers && answers.length > 0) {
            const totalStars = answers.reduce((sum, answer) => {
              const stars = parseInt(answer.value) || 0;
              return sum + stars;
            }, 0);
            satisfactionScore = Math.round((totalStars / (answers.length * 5)) * 100);
          }
        }

        return {
          ...survey,
          response_count: count || 0,
          satisfaction_score: satisfactionScore,
        };
      })
    );

    // Get all responses for demographic analysis
    const { data: allResponses, error: responsesError } = await supabase
      .from('responses')
      .select('age_range, gender');

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
    }

    // Calculate age range distribution
    const ageRangeStats: Record<string, number> = {};
    const genderStats: Record<string, number> = {};

    (allResponses || []).forEach((response: any) => {
      if (response.age_range) {
        ageRangeStats[response.age_range] = (ageRangeStats[response.age_range] || 0) + 1;
      }
      if (response.gender) {
        genderStats[response.gender] = (genderStats[response.gender] || 0) + 1;
      }
    });

    // Calculate totals
    const totalResponses = surveyStats.reduce((sum, survey) => sum + survey.response_count, 0);

    // Calculate satisfaction distribution from all responses
    let satisfactionCounts = {
      veryDissatisfied: 0,
      dissatisfied: 0,
      neutral: 0,
      satisfied: 0,
      verySatisfied: 0,
    };

    // Get all answers for star rating questions
    const { data: allAnswers } = await supabase
      .from('answers')
      .select('value, question_id');

    if (allAnswers) {
      // Get all star rating questions
      const { data: starQuestions } = await supabase
        .from('questions')
        .select('id')
        .eq('type', 'star_rating');

      const starQuestionIds = starQuestions?.map(q => q.id) || [];

      allAnswers.forEach((answer: any) => {
        if (starQuestionIds.includes(answer.question_id)) {
          const starValue = Number(answer.value);
          switch (starValue) {
            case 1:
              satisfactionCounts.veryDissatisfied++;
              break;
            case 2:
              satisfactionCounts.dissatisfied++;
              break;
            case 3:
              satisfactionCounts.neutral++;
              break;
            case 4:
              satisfactionCounts.satisfied++;
              break;
            case 5:
              satisfactionCounts.verySatisfied++;
              break;
          }
        }
      });
    }

    // Convert counts to percentages
    const totalStarRatings = Object.values(satisfactionCounts).reduce((a, b) => a + b, 0);
    const satisfactionDistribution = {
      veryDissatisfied: totalStarRatings > 0 ? Math.round((satisfactionCounts.veryDissatisfied / totalStarRatings) * 100) : 0,
      dissatisfied: totalStarRatings > 0 ? Math.round((satisfactionCounts.dissatisfied / totalStarRatings) * 100) : 0,
      neutral: totalStarRatings > 0 ? Math.round((satisfactionCounts.neutral / totalStarRatings) * 100) : 0,
      satisfied: totalStarRatings > 0 ? Math.round((satisfactionCounts.satisfied / totalStarRatings) * 100) : 0,
      verySatisfied: totalStarRatings > 0 ? Math.round((satisfactionCounts.verySatisfied / totalStarRatings) * 100) : 0,
    };

    return NextResponse.json(
      {
        totalSurveys: surveyStats.length,
        totalResponses,
        surveys: surveyStats,
        demographics: {
          ageRange: ageRangeStats,
          gender: genderStats,
        },
        satisfactionDistribution,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
