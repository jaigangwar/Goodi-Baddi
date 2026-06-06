import { supabase } from '../config/supabaseClient';

export const getCompanies = async (status) => {
  let query = supabase.from('companies').select('*').neq('role', 'Admin');
  if (status) query = query.eq('status', status);
  
  const { data, error } = await query;
  if (error) throw error;

  return { success: true, companies: data.map(c => ({
    id: c.id,
    companyName: c.company_name,
    hrName: c.hr_name,
    email: c.email,
    mobile: c.mobile,
    status: c.status
  }))};
};

export const verifyCompany = async (id, action) => {
  const status = action === 'approve' ? 'Verified' : 'Rejected';
  const { error } = await supabase.from('companies').update({ status }).eq('id', id);
  if (error) throw error;
  return { success: true, message: `Company ${status.toLowerCase()} successfully` };
};

export const deleteCompany = async (id) => {
  // Caution: This needs to delete from auth.users via an Edge Function ideally, 
  // but just removing from companies table is shown here for the UI layer.
  const { error } = await supabase.from('companies').delete().eq('id', id);
  if (error) throw error;
  return { success: true, message: 'Company deleted successfully' };
};

export const getReports = async () => {
  const { data, error } = await supabase.from('reports').select('*');
  if (error) throw error;
  return { success: true, reports: data };
};

export const resolveReport = async (id, action, resolution) => {
  const status = action === 'approve' ? 'Resolved' : 'Dismissed';
  const { error } = await supabase.from('reports').update({ status, resolution }).eq('id', id);
  if (error) throw error;
  return { success: true, message: `Report ${status.toLowerCase()} successfully` };
};

export const getModerationLogs = async () => {
  return { success: true, logs: [] };
};
