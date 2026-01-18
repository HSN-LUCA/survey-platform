const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = 'https://nbjuyltaeunxcishhwqu.supabase.co';
const supabaseServiceKey = 'sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetPassword() {
  try {
    console.log('Resetting admin password...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('New hashed password:', hashedPassword);

    const { data, error } = await supabase
      .from('admins')
      .update({ password_hash: hashedPassword })
      .eq('email', 'admin@example.com')
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ Password reset successfully');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
