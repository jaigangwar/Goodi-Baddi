import { supabase } from '../config/supabaseClient';

export const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('companies').select('*').eq('id', user.id).single();
  
  if (error) throw error;

  return {
    success: true,
    company: {
      id: data.id,
      companyName: data.company_name,
      hrName: data.hr_name,
      email: data.email,
      mobile: data.mobile,
      linkedinUrl: data.linkedin_url,
      role: data.role,
      status: data.status
    }
  };
};

export const updateProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('companies')
    .update({
      company_name: updates.companyName,
      hr_name: updates.hrName,
      mobile: updates.mobile,
      linkedin_url: updates.linkedinUrl
    })
    .eq('id', user.id);
    
  if (error) throw error;
  
  return { success: true, message: 'Profile updated successfully' };
};

export const getDashboardStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { count: totalEmployees } = await supabase.from('employees').select('*', { count: 'exact', head: true }).eq('company_id', user.id);
  const { count: totalFeedbacks } = await supabase.from('feedbacks').select('*', { count: 'exact', head: true }).eq('company_id', user.id);
  
  return {
    success: true,
    stats: {
      totalEmployees: totalEmployees || 0,
      totalFeedbacks: totalFeedbacks || 0,
      recentSearches: 0
    }
  };
};
