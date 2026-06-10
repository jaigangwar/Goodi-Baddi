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
    linkedinUrl: c.linkedin_url,
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
  // Cascading deletes manually to prevent foreign key constraint violations
  await supabase.from('reports').delete().eq('reporter_id', id);
  await supabase.from('feedbacks').delete().eq('company_id', id);
  await supabase.from('employees').delete().eq('company_id', id);

  const { error } = await supabase.from('companies').delete().eq('id', id);
  if (error) throw error;
  return { success: true, message: 'Company and all associated records deleted successfully' };
};

export const getReports = async () => {
  const { data, error } = await supabase
    .from('reports')
    .select('*, companies:reporter_id(company_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;

  // Resolve details of the reported targets (Employee, Feedback) for Admin context
  const reportsWithTargets = await Promise.all(data.map(async (report) => {
    let targetName = 'Unknown Target';
    let targetDetail = '';
    let exists = false;
    
    try {
      if (report.target_type === 'Employee') {
        const { data: emp } = await supabase
          .from('employees')
          .select('employee_name, company_name')
          .eq('id', report.target_id)
          .single();
        if (emp) {
          targetName = emp.employee_name;
          targetDetail = `Previous Company: ${emp.company_name}`;
          exists = true;
        } else {
          targetName = 'Deleted Employee';
        }
      } else if (report.target_type === 'Feedback') {
        const { data: fb } = await supabase
          .from('feedbacks')
          .select('comments, company_name, employee_id, employees:employee_id(employee_name)')
          .eq('id', report.target_id)
          .single();
        if (fb) {
          targetName = `Feedback from ${fb.company_name}`;
          targetDetail = `Comments: "${fb.comments}" | Employee: ${fb.employees?.employee_name || 'Unknown'}`;
          exists = true;
        } else {
          targetName = 'Deleted Feedback';
        }
      } else if (report.target_type === 'Company') {
        const { data: comp } = await supabase
          .from('companies')
          .select('company_name')
          .eq('id', report.target_id)
          .single();
        if (comp) {
          targetName = comp.company_name;
          exists = true;
        } else {
          targetName = 'Deleted Company';
        }
      }
    } catch (e) {
      console.error('Error fetching report target details:', e);
    }

    return {
      id: report.id,
      reporterId: report.reporter_id,
      reporterName: report.companies?.company_name || 'Unknown Company',
      targetId: report.target_id,
      targetType: report.target_type,
      targetName,
      targetDetail,
      targetExists: exists,
      reason: report.reason,
      description: report.description,
      status: report.status,
      resolution: report.resolution,
      createdAt: report.created_at
    };
  }));

  return { success: true, reports: reportsWithTargets };
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
