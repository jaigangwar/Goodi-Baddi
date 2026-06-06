import { supabase } from '../config/supabaseClient';

export const addFeedback = async (data) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('companies').select('company_name').eq('id', user.id).single();

  const { data: created, error } = await supabase.from('feedbacks').insert([{
    employee_id: data.employeeId,
    company_id: user.id,
    company_name: profile.company_name,
    rating: data.rating,
    positives: data.positives,
    negatives: data.negatives,
    comments: data.comments
  }]).select().single();

  if (error) throw error;
  return { success: true, feedbackId: created.id, message: 'Feedback submitted successfully' };
};

export const getFeedbackByEmployee = async (employeeId) => {
  const { data, error } = await supabase.from('feedbacks').select('*').eq('employee_id', employeeId);
  if (error) throw error;
  
  return { success: true, feedbacks: data.map(f => ({
    id: f.id,
    companyName: f.company_name,
    rating: f.rating,
    positives: f.positives,
    negatives: f.negatives,
    comments: f.comments,
    createdAt: f.created_at
  }))};
};

export const updateFeedback = async (id, data) => {
  const { error } = await supabase.from('feedbacks').update({
    rating: data.rating,
    positives: data.positives,
    negatives: data.negatives,
    comments: data.comments
  }).eq('id', id);
  if (error) throw error;
  return { success: true, message: 'Feedback updated successfully' };
};

export const deleteFeedback = async (id) => {
  const { error } = await supabase.from('feedbacks').delete().eq('id', id);
  if (error) throw error;
  return { success: true, message: 'Feedback deleted successfully' };
};
