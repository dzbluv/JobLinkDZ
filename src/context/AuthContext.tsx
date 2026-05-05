import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { buildFallbackUser } from './authProfile.js';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'candidate' | 'admin';
  phone?: string;
  location?: string;
  bio?: string;
  github_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  skills?: string[];
  avatar_initials?: string | null;
  avatar_color?: string | null;
}

export const USER_COLUMNS = 'id, full_name, email, role, phone, location, bio, github_url, portfolio_url, linkedin_url, skills, avatar_initials, avatar_color';

interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role?: 'candidate' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ user: User | null; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ user: User | null; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async (sessionUser: any) => {
      if (!sessionUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('users')
          .select(USER_COLUMNS)
          .eq('id', sessionUser.id)
          .single();

        if (data) {
          setUser(data as User);
        } else {
          setUser(buildFallbackUser(sessionUser) as User | null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(buildFallbackUser(sessionUser) as User | null);
      } finally {
        setIsLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Fallback for Demo Accounts
        const demoAccounts = [
          { email: 'candidate@joblinkdz.com', password: 'password123', profile: { id: 'demo-1', full_name: 'John Candidate', email: 'candidate@joblinkdz.com', role: 'candidate' } },
          { email: 'admin@joblinkdz.com', password: 'admin123', profile: { id: 'demo-2', full_name: 'Admin Recruiter', email: 'admin@joblinkdz.com', role: 'admin' } },
          { email: 'candidatedemo@joblinkdz.com', password: 'demo123456', profile: { id: 'demo-3', full_name: 'Demo Candidate', email: 'candidatedemo@joblinkdz.com', role: 'candidate' } },
          { email: 'recruiterdemo@joblinkdz.com', password: 'demo123456', profile: { id: 'demo-4', full_name: 'Demo Recruiter', email: 'recruiterdemo@joblinkdz.com', role: 'admin' } }
        ];

        const demo = demoAccounts.find(d => d.email === email && d.password === password);
        if (demo) {
          setUser(demo.profile as User);
          return { user: demo.profile as User };
        }
        
        return { user: null, error: error.message };
      }

      const fallbackProfile = buildFallbackUser(data.user, email);
      const userId = fallbackProfile?.id;
      if (!userId || !fallbackProfile) return { user: null, error: 'User data not found.' };
      
      const { data: profile, error: profileError } = await supabase.from('users').select(USER_COLUMNS).eq('id', userId).single();
      
      if (profileError || !profile) {
        await supabase.from('users').upsert(fallbackProfile);
        setUser(fallbackProfile as User);
        return { user: fallbackProfile as User };
      }
      
      setUser(profile as User);
      return { user: profile as User };
    } catch (err: any) {
      console.error('Login error:', err);
      return { user: null, error: err.message || 'An unexpected error occurred.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<{ user: User | null; error?: string }> => {
    setIsLoading(true);
    try {
      const { full_name, email, password, role = 'candidate' } = payload;

      // Try server-side admin creation first to avoid client-side email rate limits
      try {
        const resp = await fetch('/api/admin/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name, email, password, role })
        });
        const json = await resp.json().catch(() => ({}));
        if (resp.ok && json.profile) {
          setUser(json.profile as User);
          return { user: json.profile as User };
        }
        if (resp.ok && json.auth && json.auth.user) {
          const authUser = json.auth.user;
          const profile = { id: authUser.id || authUser.user_id || authUser.sub, full_name, email, role } as User;
          setUser(profile);
          return { user: profile };
        }
      } catch (serverErr) {
        console.warn('Server-side create-user failed, falling back to client signUp:', serverErr);
      }

      // Fallback: client-side sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      let id = userId;
      if (!id) {
        const userRes = await supabase.auth.getUser();
        id = userRes.data.user?.id;
      }

      if (!id) {
        return { user: null, error: 'Registration successful, but profile creation failed. Please check your email for confirmation.' };
      }

      const newProfile = { id, full_name, email, role } as User;
      const { error: insertError } = await supabase.from('users').insert(newProfile).select(USER_COLUMNS);
      if (insertError) console.warn('Profile insert error:', insertError);

      // Auto-create company for recruiters
      if (role === 'admin') {
        const { error: companyError } = await supabase.from('companies').insert({
          owner_id: id,
          name: `${full_name}'s Company`,
          industry: 'Technology',
          size: 'Medium',
          location: 'Algiers',
          description: 'Company profile created during registration.'
        });
        if (companyError) console.warn('Auto-company creation error:', companyError);
      }

      setUser(newProfile);
      return { user: newProfile };
    } catch (err: any) {
      console.error('Registration error:', err);
      return { user: null, error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUser(null);
        return;
      }
      // Only select columns we know exist, to avoid schema errors
      const { data, error } = await supabase
        .from('users')
        .select(USER_COLUMNS)
        .eq('id', session.user.id)
        .single();
      if (data && !error) {
        // Merge with existing user data to preserve any extra fields
        // data comes second so new values override old ones
        setUser(prev => prev ? { ...prev, ...data as User } : data as User);
      } else {
        // If the basic query fails, keep the existing user state
        console.warn('refreshUser could not fetch profile:', error?.message);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

