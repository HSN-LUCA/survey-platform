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

    // Get all surveys with their questions
    const { data: surveys, error } = await supabase
      .from('surveys')
      .select(`
        *,
        questions (
          *,
          options (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Get response counts for each survey
    const surveysWithCounts = await Promise.all(
      surveys.map(async (survey) => {
        const { count, error: countError } = await supabase
          .from('responses')
          .select('*', { count: 'exact', head: true })
          .eq('survey_id', survey.id);

        if (countError) {
          console.error(`Error counting responses for survey ${survey.id}:`, countError);
          return { ...survey, response_count: 0 };
        }

        return { ...survey, response_count: count || 0 };
      })
    );

    return NextResponse.json(surveysWithCounts, { status: 200 });
  } catch (error) {
    console.error('Get surveys error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const { title_en, title_ar, description_en, description_ar, questions, customer_type } = await req.json();

    // Validate required fields
    if (!title_en || !title_ar) {
      return NextResponse.json(
        { error: 'Title in both languages is required' },
        { status: 400 }
      );
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'At least one question is required' },
        { status: 400 }
      );
    }

    // Create survey
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .insert([
        {
          title_en,
          title_ar,
          description_en,
          description_ar,
          customer_type: customer_type || 'pilgrims',
          created_by: (decoded as any).id,
        },
      ])
      .select()
      .single();

    if (surveyError) {
      console.error('Survey creation error:', surveyError);
      throw new Error(`Failed to create survey: ${surveyError.message}`);
    }

    // Create questions
    if (questions && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        // Validate question content
        if (!q.content_en || !q.content_ar) {
          throw new Error(`Question ${i + 1}: Content in both languages is required`);
        }

        // Build question object - only include categories if they exist and are not empty
        const questionData: any = {
          survey_id: survey.id,
          type: q.type,
          content_en: q.content_en,
          content_ar: q.content_ar,
          required: q.required,
          order_num: i,
        };

        // Only add category fields if they have values
        // Support both new bilingual format and legacy single category field
        if (q.category_en && q.category_en.trim()) {
          questionData.category_en = q.category_en;
        } else if (q.category && q.category.trim() && !q.category_en) {
          // Fallback to legacy category field
          questionData.category = q.category;
        }
        
        if (q.category_ar && q.category_ar.trim()) {
          questionData.category_ar = q.category_ar;
        }

        const { data: question, error: questionError } = await supabase
          .from('questions')
          .insert([questionData])
          .select()
          .single();

        if (questionError) {
          console.error('Question creation error:', questionError);
          console.error('Question data:', questionData);
          throw new Error(`Failed to create question ${i + 1}: ${questionError.message}`);
        }

        // Create options for multiple choice questions
        if (q.type === 'multiple_choice' && q.options && q.options.length > 0) {
          const optionsData = q.options.map((opt: any, idx: number) => {
            // Handle both old format (string) and new format (object with text_en and text_ar)
            if (typeof opt === 'string') {
              return {
                question_id: question.id,
                text_en: opt,
                text_ar: opt,
                order_num: idx,
              };
            } else {
              return {
                question_id: question.id,
                text_en: opt.text_en || '',
                text_ar: opt.text_ar || '',
                order_num: idx,
              };
            }
          });

          const { error: optionsError } = await supabase
            .from('options')
            .insert(optionsData);

          if (optionsError) {
            console.error('Options creation error:', optionsError);
            throw new Error(`Failed to create options for question ${i + 1}: ${optionsError.message}`);
          }
        }
      }
    }

    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    console.error('Create survey error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
