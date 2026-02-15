import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language') || 'en';
    const search = searchParams.get('search') || '';

    // Fetch all countries from database
    let query = supabase.from('countries').select('code, name_en, name_ar');

    // If search term provided, filter by language
    if (search && search.length >= 2) {
      if (language === 'ar') {
        query = query.ilike('name_ar', `%${search}%`);
      } else {
        query = query.ilike('name_en', `%${search}%`);
      }
    }

    // Also search by country code
    if (search && search.length >= 1) {
      query = query.or(`code.ilike.%${search}%`);
    }

    const { data, error } = await query.order(language === 'ar' ? 'name_ar' : 'name_en');

    if (error) {
      console.error('Error fetching countries:', error);
      return NextResponse.json(
        { error: 'Failed to fetch countries' },
        { status: 500 }
      );
    }

    // Transform data based on language
    const countries = (data || []).map((country: any) => ({
      code: country.code,
      name: language === 'ar' ? country.name_ar : country.name_en,
      name_en: country.name_en,
      name_ar: country.name_ar,
    }));

    return NextResponse.json(countries, { status: 200 });
  } catch (error) {
    console.error('Error in countries API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
