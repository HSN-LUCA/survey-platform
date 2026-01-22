import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Fetch respondents with their responses
    const { data, error } = await supabase
      .from('responses')
      .select('id, survey_id, email, gender, age_range, education_level, nationality, hajj_number, submitted_at')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch respondents', details: error.message },
        { status: 500 }
      );
    }

    // Fetch surveys separately to get titles
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select('id, title_en, title_ar');

    if (surveysError) {
      console.error('Surveys error:', surveysError);
    }

    const surveyMap = new Map(
      (surveys || []).map((s: any) => [s.id, { title_en: s.title_en, title_ar: s.title_ar }])
    );

    // Transform data to include survey title
    const respondents = (data || []).map((response: any) => {
      const survey = surveyMap.get(response.survey_id);
      return {
        id: response.id,
        survey_id: response.survey_id,
        survey_title: survey?.title_en || 'Unknown Survey',
        email: response.email || 'N/A',
        phone: 'N/A',
        hajj_number: response.hajj_number || 'N/A',
        gender: response.gender || 'N/A',
        age_range: response.age_range || 'N/A',
        education_level: response.education_level || 'N/A',
        nationality: response.nationality || 'N/A',
        submitted_at: response.submitted_at,
      };
    });

    return NextResponse.json(respondents, { status: 200 });
  } catch (error) {
    console.error('Error fetching respondents:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
