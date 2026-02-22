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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;
    
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

    // Get survey with questions and options
    const { data: survey, error } = await supabase
      .from('surveys')
      .select(`
        *,
        questions (
          *,
          options (*)
        )
      `)
      .eq('id', surveyId)
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
  } catch (error) {
    console.error('Get survey error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;

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

    const { title_en, title_ar, description_en, description_ar, customer_type, questions } = await req.json();

    // Validate required fields
    if (!title_en || !title_ar) {
      return NextResponse.json(
        { error: 'Title in both languages is required' },
        { status: 400 }
      );
    }

    // Check if survey exists
    const { data: existingSurvey, error: getError } = await supabase
      .from('surveys')
      .select('id')
      .eq('id', surveyId)
      .single();

    if (getError || !existingSurvey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    // Check if survey has responses
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('id')
      .eq('survey_id', surveyId)
      .limit(1);

    const hasResponses = responses && responses.length > 0;

    // Update survey metadata
    const { error: updateError } = await supabase
      .from('surveys')
      .update({
        title_en,
        title_ar,
        description_en,
        description_ar,
        customer_type: customer_type || 'pilgrims',
      })
      .eq('id', surveyId);

    if (updateError) {
      console.error('Survey update error:', updateError);
      throw new Error(`Failed to update survey: ${updateError.message}`);
    }

    // Only update questions if survey has no responses
    if (!hasResponses && questions && questions.length > 0) {
      // Get existing questions
      const { data: existingQuestions, error: getQuestionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('survey_id', surveyId);

      if (getQuestionsError) {
        console.error('Error fetching existing questions:', getQuestionsError);
      }

      // Delete questions that are no longer in the update
      if (existingQuestions) {
        const existingIds = existingQuestions.map(q => q.id);
        const updatedIds = questions.filter((q: any) => q.id && !q.id.startsWith('temp-')).map((q: any) => q.id);
        const idsToDelete = existingIds.filter(id => !updatedIds.includes(id));

        if (idsToDelete.length > 0) {
          // Delete options for these questions
          const { error: deleteOptionsError } = await supabase
            .from('options')
            .delete()
            .in('question_id', idsToDelete);

          if (deleteOptionsError) {
            console.error('Error deleting options:', deleteOptionsError);
          }

          // Delete the questions
          const { error: deleteQuestionsError } = await supabase
            .from('questions')
            .delete()
            .in('id', idsToDelete);

          if (deleteQuestionsError) {
            console.error('Error deleting questions:', deleteQuestionsError);
          }
        }
      }

      // Update or create questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        // Validate question content
        if (!q.content_en || !q.content_ar) {
          throw new Error(`Question ${i + 1}: Content in both languages is required`);
        }

        // Build question object
        const questionData: any = {
          survey_id: surveyId,
          type: q.type,
          content_en: q.content_en,
          content_ar: q.content_ar,
          required: q.required,
          order_num: i,
        };

        if (q.category_en && q.category_en.trim()) {
          questionData.category_en = q.category_en;
        }
        if (q.category_ar && q.category_ar.trim()) {
          questionData.category_ar = q.category_ar;
        }
        // Support legacy single category field for backward compatibility
        if (q.category && q.category.trim() && !q.category_en && !q.category_ar) {
          questionData.category_en = q.category;
        }

        let question;

        // Check if this is an existing question by checking if it exists in the database
        const { data: existingQuestion, error: checkError } = await supabase
          .from('questions')
          .select('id')
          .eq('id', q.id)
          .single();

        if (existingQuestion && !checkError) {
          // Update existing question
          const { error: updateQError } = await supabase
            .from('questions')
            .update(questionData)
            .eq('id', q.id);

          if (updateQError) {
            console.error('Question update error:', updateQError);
            throw new Error(`Failed to update question ${i + 1}: ${updateQError.message}`);
          }

          // Get the updated question
          const { data: updatedQuestion, error: getQError } = await supabase
            .from('questions')
            .select()
            .eq('id', q.id)
            .single();

          if (getQError) {
            throw new Error(`Failed to fetch updated question ${i + 1}`);
          }

          question = updatedQuestion;
        } else {
          // Create new question
          const { data: newQuestion, error: createQError } = await supabase
            .from('questions')
            .insert([questionData])
            .select()
            .single();

          if (createQError) {
            console.error('Question creation error:', createQError);
            throw new Error(`Failed to create question ${i + 1}: ${createQError.message}`);
          }

          question = newQuestion;
        }

        // Handle options for multiple choice questions
        if (q.type === 'multiple_choice' && q.options && q.options.length > 0) {
          // Delete existing options for this question
          const { error: deleteOptError } = await supabase
            .from('options')
            .delete()
            .eq('question_id', question.id);

          if (deleteOptError) {
            console.error('Error deleting old options:', deleteOptError);
          }

          // Create new options
          const optionsData = q.options.map((opt: any, idx: number) => {
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

          const { error: createOptError } = await supabase
            .from('options')
            .insert(optionsData);

          if (createOptError) {
            console.error('Options creation error:', createOptError);
            throw new Error(`Failed to create options for question ${i + 1}: ${createOptError.message}`);
          }
        }
      }
    } else if (hasResponses && questions && questions.length > 0) {
      // If survey has responses, only allow adding NEW questions (not editing existing ones)
      // Get existing questions
      const { data: existingQuestions, error: getQuestionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('survey_id', surveyId);

      if (getQuestionsError) {
        console.error('Error fetching existing questions:', getQuestionsError);
      }

      const existingIds = existingQuestions?.map(q => q.id) || [];

      // Only process NEW questions (those not in the database)
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        // Check if this is a new question
        const { data: existingQuestion, error: checkError } = await supabase
          .from('questions')
          .select('id')
          .eq('id', q.id)
          .single();

        // Skip existing questions - don't allow editing them
        if (existingQuestion && !checkError) {
          continue;
        }

        // Validate question content
        if (!q.content_en || !q.content_ar) {
          throw new Error(`Question ${i + 1}: Content in both languages is required`);
        }

        // Build question object for new question
        const questionData: any = {
          survey_id: surveyId,
          type: q.type,
          content_en: q.content_en,
          content_ar: q.content_ar,
          required: q.required,
          order_num: i,
        };

        if (q.category_en && q.category_en.trim()) {
          questionData.category_en = q.category_en;
        }
        if (q.category_ar && q.category_ar.trim()) {
          questionData.category_ar = q.category_ar;
        }
        // Support legacy single category field for backward compatibility
        if (q.category && q.category.trim() && !q.category_en && !q.category_ar) {
          questionData.category_en = q.category;
        }

        // Create new question
        const { data: newQuestion, error: createQError } = await supabase
          .from('questions')
          .insert([questionData])
          .select()
          .single();

        if (createQError) {
          console.error('Question creation error:', createQError);
          throw new Error(`Failed to create question ${i + 1}: ${createQError.message}`);
        }

        // Handle options for multiple choice questions
        if (q.type === 'multiple_choice' && q.options && q.options.length > 0) {
          const optionsData = q.options.map((opt: any, idx: number) => {
            if (typeof opt === 'string') {
              return {
                question_id: newQuestion.id,
                text_en: opt,
                text_ar: opt,
                order_num: idx,
              };
            } else {
              return {
                question_id: newQuestion.id,
                text_en: opt.text_en || '',
                text_ar: opt.text_ar || '',
                order_num: idx,
              };
            }
          });

          const { error: createOptError } = await supabase
            .from('options')
            .insert(optionsData);

          if (createOptError) {
            console.error('Options creation error:', createOptError);
            throw new Error(`Failed to create options for question ${i + 1}: ${createOptError.message}`);
          }
        }
      }
    }

    // Fetch and return updated survey
    const { data: updatedSurvey, error: fetchError } = await supabase
      .from('surveys')
      .select(`
        *,
        questions (
          *,
          options (*)
        )
      `)
      .eq('id', surveyId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch updated survey: ${fetchError.message}`);
    }

    return NextResponse.json(updatedSurvey, { status: 200 });
  } catch (error) {
    console.error('Update survey error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;
    
    console.log('DELETE request for survey:', surveyId);

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    console.log('Auth header present:', !!authHeader);
    console.log('Token present:', !!token);

    if (!token) {
      console.error('No token provided');
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    console.log('Token verified:', !!decoded);

    if (!decoded) {
      console.error('Invalid token');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verify survey exists first
    const { data: survey, error: getError } = await supabase
      .from('surveys')
      .select('id')
      .eq('id', surveyId)
      .single();

    if (getError || !survey) {
      console.error('Survey not found:', getError);
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    console.log('Survey found, proceeding with deletion');

    // Delete in order: answers -> responses -> questions -> options -> survey
    // This ensures we respect any foreign key constraints
    
    // First, get all responses for this survey
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('id')
      .eq('survey_id', surveyId);

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
    } else if (responses && responses.length > 0) {
      // Delete answers for these responses
      const responseIds = responses.map(r => r.id);
      const { error: answersError } = await supabase
        .from('answers')
        .delete()
        .in('response_id', responseIds);

      if (answersError) {
        console.error('Error deleting answers:', answersError);
      }

      // Delete responses
      const { error: deleteResponsesError } = await supabase
        .from('responses')
        .delete()
        .eq('survey_id', surveyId);

      if (deleteResponsesError) {
        console.error('Error deleting responses:', deleteResponsesError);
      }
    }

    // Delete options for questions in this survey
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id')
      .eq('survey_id', surveyId);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
    } else if (questions && questions.length > 0) {
      const questionIds = questions.map(q => q.id);
      const { error: optionsError } = await supabase
        .from('options')
        .delete()
        .in('question_id', questionIds);

      if (optionsError) {
        console.error('Error deleting options:', optionsError);
      }
    }

    // Delete questions
    const { error: deleteQuestionsError } = await supabase
      .from('questions')
      .delete()
      .eq('survey_id', surveyId);

    if (deleteQuestionsError) {
      console.error('Error deleting questions:', deleteQuestionsError);
    }

    // Finally, delete the survey
    const { error: deleteError } = await supabase
      .from('surveys')
      .delete()
      .eq('id', surveyId);

    if (deleteError) {
      console.error('Delete error details:', {
        code: deleteError.code,
        message: deleteError.message,
        details: deleteError.details,
        hint: deleteError.hint,
      });
      
      // Return the actual error message from Supabase
      return NextResponse.json(
        { error: deleteError.message || 'Failed to delete survey' },
        { status: 500 }
      );
    }

    console.log('Survey deleted successfully');
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete survey error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
