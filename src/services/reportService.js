import { supabase } from '../config/supabaseClient';

export const submitReport = async (data) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: created, error } = await supabase.from('reports').insert([{
    reporter_id: user.id,
    target_id: data.targetId,
    target_type: data.targetType,
    reason: data.reason,
    description: data.description
  }]).select().single();

  if (error) throw error;
  return { success: true, reportId: created.id, message: 'Report submitted successfully.' };
};

export const getMyReports = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('reports').select('*').eq('reporter_id', user.id);
  
  if (error) throw error;
  return { success: true, reports: data };
};
