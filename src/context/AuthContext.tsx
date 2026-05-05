import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role?: 'candidate' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (payload: RegisterPayload) => Promise<User | null>;
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
          .select('id, full_name, email, role, phone, location')
          .eq('id', sessionUser.id)
          .single();

        if (data) {
          setUser(data as User);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
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

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const userId = data.user?.id;
      if (!userId) return null;
      const { data: profile, error: profileError } = await supabase.from('users').select('id, full_name, email, role, phone, location').eq('id', userId).single();
      if (profileError || !profile) {
        const defaultProfile = { id: userId, full_name: 'Anonymous', email, role: 'candidate' } as User;
        await supabase.from('users').insert(defaultProfile).select();
        setUser(defaultProfile);
        return defaultProfile;
      }
      setUser(profile as User);
      return profile as User;
    } catch (err) {
      console.error('Login error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<User | null> => {
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
          return json.profile as User;
        }
        if (resp.ok && json.auth && json.auth.user) {
          const authUser = json.auth.user;
          const profile = { id: authUser.id || authUser.user_id || authUser.sub, full_name, email, role } as User;
          setUser(profile);
          return profile;
        }
      } catch (serverErr) {
        console.warn('Server-side create-user failed, falling back to client signUp:', serverErr);
      }

      // Fallback: client-side sign up (may be rate-limited by Supabase email sending)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id || signUpData.user?.id;
      let id = userId;
      if (!id) {
        const userRes = await supabase.auth.getUser();
        id = userRes.data.user?.id;
      }

      if (!id) {
        console.warn('Could not determine user id after sign-up');
        return null;
      }

      const newProfile = { id, full_name, email, role } as User;
      const { error: insertError } = await supabase.from('users').insert(newProfile).select();
      if (insertError) console.warn('Profile insert error:', insertError);

      setUser(newProfile);
      return newProfile;
    } catch (err) {
      console.error('Registration error:', err);
      return null;
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
        .select('id, full_name, email, role, phone, location')
        .eq('id', session.user.id)
        .single();
      if (data && !error) {
        // Merge with existing user data to preserve any extra fields
        setUser(prev => prev ? { ...data as User, ...prev } : data as User);
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

