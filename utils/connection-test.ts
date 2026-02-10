// Simple connection test
import { supabase } from '../lib/supabase'

console.log('=== SUPABASE CONNECTION TEST ===');
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Testing connection...');

// Test basic connection
const testConnection = async () => {
  try {
    // Test service health
    const { data, error } = await supabase.from('profiles').select('count').single();
    
    if (error) {
      console.error('❌ Connection Error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      if (error.message.includes('relation "profiles" does not exist')) {
        console.log('💡 You need to run the database schema SQL file in Supabase dashboard');
      }
      
      if (error.message.includes('JWT')) {
        console.log('💡 Check your anon key in .env.local file');
      }
      
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log('✅ Database accessible');
    return true;
    
  } catch (err) {
    console.error('❌ Unexpected Error:', err);
    return false;
  }
};

// Test authentication
const testAuth = async () => {
  try {
    console.log('Testing auth session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Auth Error:', error);
      return false;
    }
    
    console.log('✅ Auth working');
    console.log('Current session:', session ? 'Active' : 'None');
    return true;
    
  } catch (err) {
    console.error('❌ Auth Unexpected Error:', err);
    return false;
  }
};

// Run tests
export const runTests = async () => {
  const connectionOk = await testConnection();
  const authOk = await testAuth();
  
  console.log('\n=== TEST RESULTS ===');
  console.log('Database Connection:', connectionOk ? '✅ OK' : '❌ FAILED');
  console.log('Authentication:', authOk ? '✅ OK' : '❌ FAILED');
  
  if (!connectionOk || !authOk) {
    console.log('\n=== TROUBLESHOOTING ===');
    console.log('1. Check your Supabase URL and keys in .env.local');
    console.log('2. Run the SQL schema file in Supabase dashboard');
    console.log('3. Check authentication settings in Supabase dashboard');
  }
};