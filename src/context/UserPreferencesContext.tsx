import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface UserPreferences {
  favoriteJobs: string[];
  followedCompanies: string[];
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  toggleFavoriteJob: (jobId: string) => Promise<void>;
  toggleFollowCompany: (companyId: string) => Promise<void>;
  isFavorite: (jobId: string) => boolean;
  isFollowing: (companyId: string) => boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteJobs: [],
    followedCompanies: []
  });

  useEffect(() => {
    if (user?.id) {
      fetchPreferences();
    } else {
      setPreferences({ favoriteJobs: [], followedCompanies: [] });
    }
  }, [user?.id]);

  const fetchPreferences = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data && !error) {
        setPreferences({
          favoriteJobs: data.favorite_jobs || [],
          followedCompanies: data.followed_companies || []
        });
      } else if (error && error.code === 'PGRST116') {
        // Preference record doesn't exist yet, create one
        await supabase.from('user_preferences').insert({ user_id: user.id });
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    }
  };

  const toggleFavoriteJob = async (jobId: string) => {
    if (!user?.id) return;
    
    const newFavorites = preferences.favoriteJobs.includes(jobId)
      ? preferences.favoriteJobs.filter(id => id !== jobId)
      : [...preferences.favoriteJobs, jobId];
    
    try {
      setPreferences(prev => ({ ...prev, favoriteJobs: newFavorites }));
      await supabase
        .from('user_preferences')
        .update({ favorite_jobs: newFavorites })
        .eq('user_id', user.id);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const toggleFollowCompany = async (companyId: string) => {
    if (!user?.id) return;
    
    const newFollows = preferences.followedCompanies.includes(companyId)
      ? preferences.followedCompanies.filter(id => id !== companyId)
      : [...preferences.followedCompanies, companyId];
    
    try {
      setPreferences(prev => ({ ...prev, followedCompanies: newFollows }));
      await supabase
        .from('user_preferences')
        .update({ followed_companies: newFollows })
        .eq('user_id', user.id);
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const isFavorite = (jobId: string) => preferences.favoriteJobs.includes(jobId);
  const isFollowing = (companyId: string) => preferences.followedCompanies.includes(companyId);

  return (
    <UserPreferencesContext.Provider value={{ preferences, toggleFavoriteJob, toggleFollowCompany, isFavorite, isFollowing }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
