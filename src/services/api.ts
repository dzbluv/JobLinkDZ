import { supabase } from '../lib/supabase';
import type { JobOffer } from '../data/mockJobs';
import type { Company } from '../data/mockCompanies';
import type { Application } from '../data/mockApplications';

// JOBS
export const jobsAPI = {
  getAll: async (): Promise<JobOffer[]> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as JobOffer[];
    } catch (e) {
      console.error('Error fetching jobs:', e);
      return [];
    }
  },
  getById: async (id: string): Promise<JobOffer | null> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as JobOffer;
    } catch (e) {
      console.error('Error fetching job:', e);
      return null;
    }
  },
  create: async (job: Omit<JobOffer, 'id'>): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single();
      if (error) throw error;
      return data.id;
    } catch (e) {
      console.error('Error creating job:', e);
      return '';
    }
  },
  update: async (id: string, updateData: Partial<JobOffer>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Error updating job:', e);
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Error deleting job:', e);
    }
  }
};

// COMPANIES
export const companiesAPI = {
  getAll: async (): Promise<Company[]> => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      if (error) throw error;
      return data as Company[];
    } catch (e) {
      console.error('Error fetching companies:', e);
      return [];
    }
  },
  getById: async (id: string): Promise<Company | null> => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Company;
    } catch (e) {
      console.error('Error fetching company:', e);
      return null;
    }
  }
};

// APPLICATIONS
export const applicationsAPI = {
  getAll: async (): Promise<Application[]> => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Application[];
    } catch (e) {
      console.error('Error fetching applications:', e);
      return [];
    }
  },
  getByUserId: async (userId: string): Promise<Application[]> => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('candidate_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Application[];
    } catch (e) {
      console.error('Error fetching user applications:', e);
      return [];
    }
  },
  create: async (application: Omit<Application, 'id'>): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert(application)
        .select()
        .single();
      if (error) throw error;
      return data.id;
    } catch (e) {
      console.error('Error creating application:', e);
      return '';
    }
  },
  updateStatus: async (id: string, status: Application['status']): Promise<void> => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.error('Error updating application status:', e);
    }
  }
};

// Seed utility (only for development/testing)
export const seedDatabase = async (mockJobs: JobOffer[], mockCompanies: Company[], mockApplications: Application[]) => {
  console.log("Seeding with Supabase is disabled currently. Use Supabase UI or migrations instead.");
};
