import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import type { JobOffer } from '../data/mockJobs';
import type { Company } from '../data/mockCompanies';
import type { Application } from '../data/mockApplications';

// JOBS
export const jobsAPI = {
  getAll: async (): Promise<JobOffer[]> => {
    try {
      const q = query(collection(db, 'jobs'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as JobOffer));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'jobs');
      return [];
    }
  },
  getById: async (id: string): Promise<JobOffer | null> => {
    try {
      const docRef = doc(db, 'jobs', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) return { id: snap.id, ...snap.data() } as JobOffer;
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `jobs/${id}`);
      return null;
    }
  },
  create: async (job: Omit<JobOffer, 'id'>): Promise<string> => {
    try {
      const docRef = doc(collection(db, 'jobs'));
      await setDoc(docRef, job);
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'jobs');
      return '';
    }
  },
  update: async (id: string, data: Partial<JobOffer>): Promise<void> => {
    try {
      const docRef = doc(db, 'jobs', id);
      await updateDoc(docRef, data);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `jobs/${id}`);
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'jobs', id);
      await deleteDoc(docRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `jobs/${id}`);
    }
  }
};

// COMPANIES
export const companiesAPI = {
  getAll: async (): Promise<Company[]> => {
    try {
      const snap = await getDocs(collection(db, 'companies'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Company));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'companies');
      return [];
    }
  },
  getById: async (id: string): Promise<Company | null> => {
    try {
      const docRef = doc(db, 'companies', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) return { id: snap.id, ...snap.data() } as Company;
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `companies/${id}`);
      return null;
    }
  }
};

// APPLICATIONS
export const applicationsAPI = {
  getAll: async (): Promise<Application[]> => {
    try {
      const q = query(collection(db, 'applications'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Application));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'applications');
      return [];
    }
  },
  getByUserId: async (userId: string): Promise<Application[]> => {
    try {
      const q = query(collection(db, 'applications'), where('candidate_id', '==', userId), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Application));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'applications');
      return [];
    }
  },
  create: async (application: Omit<Application, 'id'>): Promise<string> => {
    try {
      const docRef = doc(collection(db, 'applications'));
      await setDoc(docRef, application);
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'applications');
      return '';
    }
  },
  updateStatus: async (id: string, status: Application['status']): Promise<void> => {
    try {
      const docRef = doc(db, 'applications', id);
      await updateDoc(docRef, { status });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `applications/${id}`);
    }
  }
};

// Seed utility (only for development/testing)
export const seedDatabase = async (mockJobs: JobOffer[], mockCompanies: Company[], mockApplications: Application[]) => {
  try {
    const compRef = collection(db, 'companies');
    if ((await getDocs(compRef)).empty) {
      for (const comp of mockCompanies) {
        await setDoc(doc(db, 'companies', comp.id), comp);
      }
    }

    const jobsRef = collection(db, 'jobs');
    if ((await getDocs(jobsRef)).empty) {
      for (const job of mockJobs) {
        await setDoc(doc(db, 'jobs', job.id), job);
      }
    }
    
    const appsRef = collection(db, 'applications');
    if ((await getDocs(appsRef)).empty) {
      for (const app of mockApplications) {
        await setDoc(doc(db, 'applications', app.id), app);
      }
    }
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
