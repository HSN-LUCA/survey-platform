import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
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

export async function POST(req: NextRequest) {
  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { survey_id, responses, userDetails } = requestBody;

    console.log('Received request:', { survey_id, responses: responses?.length, userDetails });

    if (!survey_id || !responses) {
      return NextResponse.json(
        { error: 'Survey ID and responses are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: 'Responses must be a non-empty array' },
        { status: 400 }
      );
    }

    // Generate a unique session ID for this response
    const sessionId = uuidv4();

    // Create response record with user details
    const responsePayload = {
      survey_id,
      user_session_id: sessionId,
      email: userDetails?.email || null,
      hajj_number: userDetails?.hajjNumber || null,
      gender: userDetails?.gender || null,
      age_range: userDetails?.ageRange || null,
      education_level: userDetails?.educationLevel || null,
      nationality: userDetails?.nationality || null,
    };

    console.log('Inserting response with payload:', responsePayload);

    const { data: responseRecord, error: responseError } = await supabase
      .from('responses')
      .insert([responsePayload])
      .select()
      .single();

    if (responseError) {
      console.error('Response insert error:', {
        message: responseError.message,
        code: responseError.code,
        details: responseError.details,
      });
      return NextResponse.json(
        { error: `Database error: ${responseError.message}` },
        { status: 500 }
      );
    }

    console.log('Response record created:', responseRecord);

    // Insert answers for each question
    const answersData = responses.map((answer: any) => ({
      response_id: responseRecord.id,
      question_id: answer.question_id,
      value: String(answer.value),
    }));

    console.log('Inserting answers:', answersData);

    const { error: answersError } = await supabase
      .from('answers')
      .insert(answersData);

    if (answersError) {
      console.error('Answers insert error:', {
        message: answersError.message,
        code: answersError.code,
        details: answersError.details,
      });
      return NextResponse.json(
        { error: `Database error: ${answersError.message}` },
        { status: 500 }
      );
    }

    console.log('Survey submission successful');
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Create response error:', error);
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

    const { searchParams } = new URL(req.url);
    const surveyId = searchParams.get('survey_id');

    if (!surveyId) {
      return NextResponse.json(
        { error: 'Survey ID is required' },
        { status: 400 }
      );
    }

    const { data: responses, error } = await supabase
      .from('responses')
      .select(`
        *,
        answers (
          *
        )
      `)
      .eq('survey_id', surveyId)
      .order('submitted_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ responses }, { status: 200 });
  } catch (error) {
    console.error('Get responses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
