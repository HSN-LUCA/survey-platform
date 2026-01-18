const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = 'https://nbjuyltaeunxcishhwqu.supabase.co';
const supabaseServiceKey = 'sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedAdmin() {
  try {
    console.log('Checking if admin exists...');
    
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('id')
      .eq('email', 'admin@example.com')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingAdmin) {
      console.log('✅ Admin already exists');
      return;
    }

    console.log('Creating admin account...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const { data: admin, error: insertError } = await supabase
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

    if (insertError) {
      throw insertError;
    }

    console.log('✅ Admin created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
