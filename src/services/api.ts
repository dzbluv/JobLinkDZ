import { supabase } from "../lib/supabase";
import type { JobOffer } from "../data/mockJobs";
import type { Company } from "../data/mockCompanies";
import type { Application } from "../data/mockApplications";

// JOBS
export const jobsAPI = {
  getAll: async (): Promise<JobOffer[]> => {
    try {
<<<<<<< HEAD
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as JobOffer[];
    } catch (e) {
      console.error("Error fetching jobs:", e);
=======
      const { data, error, status, statusText } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[jobsAPI] Supabase error:', error.message, 'Status:', status, statusText);
        throw error;
      }
      
      console.log(`[jobsAPI] Successfully fetched ${data?.length || 0} jobs.`);
      return (data || []) as JobOffer[];
    } catch (e) {
      console.error('[jobsAPI] Unexpected error fetching jobs:', e);
>>>>>>> 90a2904 (azuul)
      return [];
    }
  },
  getById: async (id: string): Promise<JobOffer | null> => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as JobOffer;
    } catch (e) {
      console.error("Error fetching job:", e);
      return null;
    }
  },
  create: async (job: Omit<JobOffer, "id">): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert(job)
        .select()
        .single();
      if (error) throw error;
      return data.id;
    } catch (e) {
      console.error("Error creating job:", e);
      return "";
    }
  },
  update: async (id: string, updateData: Partial<JobOffer>): Promise<void> => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("Error updating job:", e);
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("Error deleting job:", e);
    }
  },
  getByCompanyId: async (companyId: string): Promise<JobOffer[]> => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as JobOffer[];
    } catch (e) {
      console.error("Error fetching jobs by company:", e);
      return [];
    }
  },
};

// COMPANIES
export const companiesAPI = {
  getAll: async (): Promise<Company[]> => {
    try {
      const { data, error } = await supabase.from("companies").select("*");
      if (error) throw error;
      return data as Company[];
    } catch (e) {
      console.error("Error fetching companies:", e);
      return [];
    }
  },
  getById: async (id: string): Promise<Company | null> => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Company;
    } catch (e) {
      console.error("Error fetching company:", e);
      return null;
    }
  },
  getByOwnerId: async (ownerId: string): Promise<Company | null> => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", ownerId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data as Company | null;
    } catch (e) {
      console.error("Error fetching company by owner:", e);
      return null;
    }
  },
  create: async (company: Omit<Company, "id">): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .insert(company)
        .select()
        .single();
      if (error) throw error;
      return data.id;
    } catch (e) {
      console.error("Error creating company:", e);
      return "";
    }
  },
  update: async (id: string, updateData: Partial<Company>): Promise<void> => {
    try {
      const { error } = await supabase
        .from("companies")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("Error updating company:", e);
    }
  },
};

// APPLICATIONS
export const applicationsAPI = {
  getAll: async (): Promise<Application[]> => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*, jobs(title, company, company_id), users(full_name, email, phone, location)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Application[];
    } catch (e) {
      console.error("Error fetching applications:", e);
      return [];
    }
  },
  getByUserId: async (userId: string): Promise<Application[]> => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*, jobs(title, company, company_id), users(full_name, email, phone, location)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Application[];
    } catch (e) {
      console.error("Error fetching user applications:", e);
      return [];
    }
  },
  create: async (payload: {
    user_id: string;
    job_id: string;
    status?: string;
    resume_url?: string;
    cover_letter?: string;
    applied_at: string;
  }): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          user_id: payload.user_id,
          job_id: payload.job_id,
          status: payload.status || "pending",
          resume_url: payload.resume_url,
          cover_letter: payload.cover_letter,
          applied_at: payload.applied_at,
        })
        .select()
        .single();
      if (error) throw error;
      return data.id;
    } catch (e) {
      console.error("Error creating application:", e);
      return "";
    }
  },
  updateStatus: async (
    id: string,
    status: Application["status"],
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("Error updating application status:", e);
    }
  },
};

// STORAGE
export const storageAPI = {
  uploadResume: async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (error) throw error;
      return data.path;
    } catch (e) {
      console.error("Error uploading resume:", e);
      return null;
    }
  },

  getResumeUrl: async (path: string): Promise<string | null> => {
    try {
      // Create a signed URL valid for 60 minutes
      const { data, error } = await supabase.storage
        .from("resumes")
        .createSignedUrl(path, 3600);

      if (error) throw error;
      return data.signedUrl;
    } catch (e) {
      console.error("Error getting signed resume URL:", e);
      return null;
    }
  },
};

// Seed utility (only for development/testing)
export const seedDatabase = async (
  mockJobs: JobOffer[],
  mockCompanies: Company[],
  mockApplications: Application[],
) => {
  console.log(
    "Seeding with Supabase is disabled currently. Use Supabase UI or migrations instead.",
  );
};
