import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

export interface JobAlert {
  id: string;
  userId: string;
  keyword: string;
  location: string;
  jobType: string;
  createdAt: string;
}

interface JobAlertContextType {
  alerts: JobAlert[];
  addAlert: (alert: Omit<JobAlert, 'id' | 'userId' | 'createdAt'>) => void;
  removeAlert: (id: string) => void;
  checkJobAgainstAlerts: (job: any) => void;
}

const JobAlertContext = createContext<JobAlertContextType | undefined>(undefined);

export function JobAlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const addAlert = (alertData: Omit<JobAlert, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    
    const newAlert: JobAlert = {
      ...alertData,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const checkJobAgainstAlerts = (job: any) => {
    alerts.forEach(alert => {
      const matchesKeyword = !alert.keyword || 
        job.title.toLowerCase().includes(alert.keyword.toLowerCase()) || 
        job.company.toLowerCase().includes(alert.keyword.toLowerCase());
      
      const matchesLocation = !alert.location || 
        job.location.toLowerCase().includes(alert.location.toLowerCase());
      
      const matchesType = !alert.jobType || 
        job.job_type === alert.jobType;

      if (matchesKeyword && matchesLocation && matchesType) {
        addNotification({
          userId: alert.userId,
          title: 'Job Alert Match!',
          message: `A new job matching your alert for "${alert.keyword || 'any job'}" was posted: ${job.title} at ${job.company}.`,
          type: 'system',
          meta: { jobId: job.id }
        });
      }
    });
  };

  return (
    <JobAlertContext.Provider value={{ alerts, addAlert, removeAlert, checkJobAgainstAlerts }}>
      {children}
    </JobAlertContext.Provider>
  );
}

export function useJobAlerts() {
  const context = useContext(JobAlertContext);
  if (context === undefined) {
    throw new Error('useJobAlerts must be used within a JobAlertProvider');
  }
  return context;
}
