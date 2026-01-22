import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Fetch respondents - simple query
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false });

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
        full_name: response.full_name || 'N/A',
        email: response.email || 'N/A',
        phone: response.phone || 'N/A',
        hajj_number: response.hajj_number || 'N/A',
        category: response.category || 'N/A',
        created_at: response.created_at,
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
