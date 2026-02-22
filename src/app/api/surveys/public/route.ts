import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const surveyId = searchParams.get('id');

    if (surveyId) {
      // Get single survey by ID with questions and options
      const { data: survey, error } = await supabase
        .from('surveys')
        .select(`
          id,
          title_en,
          title_ar,
          description_en,
          description_ar,
          customer_type,
          created_at,
          questions (
            id,
            type,
            content_en,
            content_ar,
            required,
            order_num,
            category_en,
            category_ar,
            options (
              id,
              text_en,
              text_ar,
              order_num
            )
          )
        `)
        .eq('id', surveyId)
        .eq('is_archived', false)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Survey not found' },
            { status: 404 }
          );
        }
        throw error;
      }

      return NextResponse.json(survey, { status: 200 });
    } else {
      // Get all surveys with their questions and options
      const { data: surveys, error } = await supabase
        .from('surveys')
        .select(`
          id,
          title_en,
          title_ar,
          description_en,
          description_ar,
          customer_type,
          created_at,
          questions (
            id,
            type,
            content_en,
            content_ar,
            required,
            order_num,
            category_en,
            category_ar,
            options (
              id,
              text_en,
              text_ar,
              order_num
            )
          )
        `)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return NextResponse.json(surveys, { status: 200 });
    }
  } catch (error) {
    console.error('Get public surveys error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
