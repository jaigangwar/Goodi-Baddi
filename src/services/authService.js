import { supabase } from '../config/supabaseClient';
import { setToken, setUser } from '../utils/auth';

/**
 * Register new company (Email OTP Flow)
 */
export const signup = async (data) => {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        companyName: data.companyName,
        hrName: data.hrName,
        mobile: data.mobile,
        linkedinUrl: data.linkedinUrl
      }
    }
  });

  if (error) throw error;
  
  return {
    success: true,
    message: 'OTP sent to your email! Please verify.',
    email: data.email
  };
};

/**
 * Verify OTP
 */
export const verifyOtp = async (email, otp) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'signup'
  });

  if (error) throw error;

  return { success: true, message: 'Email verified successfully!' };
};

/**
 * Login with Google
 */
export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  });
  if (error) throw error;
  return { success: true };
};

/**
 * Login company user
 */
export const login = async (credentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  });

  if (error) throw error;

  // Fetch the company profile from public.companies
  const { data: companyProfile, error: profileError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) throw profileError;

  const companyData = {
    id: companyProfile.id,
    companyName: companyProfile.company_name,
    hrName: companyProfile.hr_name,
    email: companyProfile.email,
    role: companyProfile.role,
    status: companyProfile.status
  };

  setToken(data.session.access_token);
  setUser(companyData);

  return {
    success: true,
    token: data.session.access_token,
    company: companyData
  };
};

/**
 * Logout user
 */
export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Request password reset
 */
export const forgotPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return { success: true, message: 'Password reset link sent to your email' };
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return { success: true, message: 'Password updated successfully' };
};

export const verifyEmail = async (token) => {
  return { success: true, message: 'Email verified' };
};
