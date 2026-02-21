import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch the original survey
    const { data: originalSurvey, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single();

    if (surveyError || !originalSurvey) {
      console.error('Survey fetch error:', surveyError);
      return Response.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Fetch all questions for the survey
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('survey_id', surveyId);

    if (questionsError) {
      console.error('Questions fetch error:', questionsError);
      return Response.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }

    // Create new survey with "(Clone)" suffix
    const newSurveyData = {
      title_en: `${originalSurvey.title_en} (Clone)`,
      title_ar: `${originalSurvey.title_ar} (Clone)`,
      description_en: originalSurvey.description_en,
      description_ar: originalSurvey.description_ar,
      customer_type: originalSurvey.customer_type,
      created_by: decoded.id,
      created_at: new Date().toISOString(),
    };

    const { data: newSurvey, error: createSurveyError } = await supabase
      .from('surveys')
      .insert([newSurveyData])
      .select()
      .single();

    if (createSurveyError || !newSurvey) {
      console.error('Survey creation error:', createSurveyError);
      return Response.json({ error: 'Failed to create survey' }, { status: 500 });
    }

    // Clone all questions
    if (questions && questions.length > 0) {
      const newQuestions = questions.map((question) => ({
        survey_id: newSurvey.id,
        type: question.type,
        content_en: question.content_en,
        content_ar: question.content_ar,
        required: question.required,
        order_num: question.order_num,
        star_count: question.star_count,
        percentage_min: question.percentage_min,
        percentage_max: question.percentage_max,
        percentage_step: question.percentage_step,
      }));

      const { data: createdQuestions, error: createQuestionsError } = await supabase
        .from('questions')
        .insert(newQuestions)
        .select();

      if (createQuestionsError) {
        console.error('Questions creation error:', createQuestionsError);
        return Response.json({ error: 'Failed to clone questions' }, { status: 500 });
      }

      // Clone options for multiple choice questions
      if (createdQuestions) {
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].type === 'multiple_choice') {
            const { data: options, error: optionsError } = await supabase
              .from('options')
              .select('*')
              .eq('question_id', questions[i].id);

            if (optionsError) {
              console.error('Options fetch error:', optionsError);
              continue;
            }

            if (options && options.length > 0) {
              const newOptions = options.map((option) => ({
                question_id: createdQuestions[i].id,
                text_en: option.text_en,
                text_ar: option.text_ar,
                order_num: option.order_num,
              }));

              const { error: optionsInsertError } = await supabase
                .from('options')
                .insert(newOptions);

              if (optionsInsertError) {
                console.error('Options insert error:', optionsInsertError);
              }
            }
          }
        }
      }
    }

    return Response.json(newSurvey, { status: 201 });
  } catch (error) {
    console.error('Error cloning survey:', error);
    return Response.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
