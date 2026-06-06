import { supabase } from '../config/supabaseClient';

export const searchEmployees = async (params) => {
  let query = supabase.from('employees').select('*');
  
  if (params.name) query = query.ilike('employee_name', `%${params.name}%`);
  if (params.mobile) query = query.eq('mobile', params.mobile);
  if (params.email) query = query.ilike('email', `%${params.email}%`);
  if (params.linkedin) query = query.ilike('linkedin_url', `%${params.linkedin}%`);

  const { data, error } = await query;
  if (error) throw error;

  const results = data.map(e => ({
    id: e.id,
    employeeName: e.employee_name,
    companyName: e.company_name,
    email: e.email,
    mobile: e.mobile,
    designation: e.designation,
    rating: e.rating
  }));

  return { success: true, results, count: results.length };
};

export const getEmployeeById = async (id) => {
  const { data: employee, error: empError } = await supabase.from('employees').select('*').eq('id', id).single();
  if (empError) throw empError;

  const { data: feedbacks, error: feedError } = await supabase.from('feedbacks').select('*').eq('employee_id', id);
  if (feedError) throw feedError;

  const employeeData = {
    id: employee.id,
    employeeName: employee.employee_name,
    companyName: employee.company_name,
    email: employee.email,
    mobile: employee.mobile,
    designation: employee.designation,
    joiningDate: employee.joining_date,
    leavingDate: employee.leaving_date,
    reasonForLeaving: employee.reason_for_leaving,
    rating: employee.rating,
    feedbacks: feedbacks.map(f => ({
      id: f.id,
      companyName: f.company_name,
      rating: f.rating,
      positives: f.positives,
      negatives: f.negatives,
      comments: f.comments,
      createdAt: f.created_at
    }))
  };

  // Add to recently viewed in localStorage
  try {
    const recentStr = localStorage.getItem('recently_viewed');
    let recent = recentStr ? JSON.parse(recentStr) : [];
    recent = recent.filter(p => p.id !== employeeData.id);
    recent.unshift({
      id: employeeData.id,
      employeeName: employeeData.employeeName,
      designation: employeeData.designation,
      companyName: employeeData.companyName,
      rating: employeeData.rating
    });
    if (recent.length > 5) recent.length = 5;
    localStorage.setItem('recently_viewed', JSON.stringify(recent));
  } catch (e) {
    console.error('Error saving recent profile', e);
  }

  return { success: true, employee: employeeData };
};

export const addEmployee = async (data) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('companies').select('company_name').eq('id', user.id).single();

  const { data: created, error } = await supabase.from('employees').insert([{
    employee_name: data.employeeName,
    mobile: data.mobile,
    email: data.email,
    linkedin_url: data.linkedinUrl,
    designation: data.designation,
    joining_date: data.joiningDate,
    leaving_date: data.leavingDate,
    reason_for_leaving: data.reasonForLeaving,
    employment_type: data.employmentType,
    company_id: user.id,
    company_name: profile.company_name
  }]).select().single();

  if (error) throw error;
  return { success: true, employeeId: created.id, message: 'Employee record created successfully' };
};

export const getRecentlyViewed = async () => {
  try {
    const recentStr = localStorage.getItem('recently_viewed');
    const profiles = recentStr ? JSON.parse(recentStr) : [];
    return { success: true, profiles };
  } catch (e) {
    return { success: true, profiles: [] };
  }
};

export const updateEmployee = async (id, data) => {
  const { error } = await supabase.from('employees').update({
    employee_name: data.employeeName,
    mobile: data.mobile,
    email: data.email,
    designation: data.designation,
    leaving_date: data.leavingDate,
    reason_for_leaving: data.reasonForLeaving
  }).eq('id', id);

  if (error) throw error;
  return { success: true, message: 'Employee updated successfully' };
};

export const deleteEmployee = async (id) => {
  const { error } = await supabase.from('employees').delete().eq('id', id);
  if (error) throw error;
  return { success: true, message: 'Employee deleted successfully' };
};
