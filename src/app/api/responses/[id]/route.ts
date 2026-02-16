import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: responseId } = await params;

    if (!responseId) {
      return NextResponse.json(
        { error: 'Response ID is required' },
        { status: 400 }
      );
    }

    // Delete the response and its answers
    const { error } = await supabase
      .from('responses')
      .delete()
      .eq('id', responseId);

    if (error) {
      console.error('Error deleting response:', error);
      return NextResponse.json(
        { error: 'Failed to delete response', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Response deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE response:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
