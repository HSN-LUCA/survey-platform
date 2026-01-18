import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .eq('email', 'admin@example.com')
      .single();

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin already exists' },
        { status: 200 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin
    const { data: admin, error } = await supabase
      .from('admins')
      .insert([
        {
          email: 'admin@example.com',
          password_hash: hashedPassword,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: 'Admin created successfully', admin },
      { status: 201 }
    );
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
