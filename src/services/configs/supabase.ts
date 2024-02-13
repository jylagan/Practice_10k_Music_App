import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configurations
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseKey = Constants.expoConfig?.extra?.supabaseKey;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the Supabase client
export default supabase;