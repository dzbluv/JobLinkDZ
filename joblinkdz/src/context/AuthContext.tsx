import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'candidate' | 'admin';
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: (role?: 'candidate' | 'admin') => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
          } else {
            // Document doesn't exist, this might be a sign up that was interrupted
            setUser(null);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (intendedRole?: 'candidate' | 'admin'): Promise<User | null> => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = { id: firebaseUser.uid, ...userDoc.data() } as User;
        setUser(userData);
        return userData;
      } else {
        // Create new user profile with intended role from Register page, defaulting to candidate
        const newUser: Omit<User, 'id'> = {
          full_name: firebaseUser.displayName || 'Anonymous User',
          email: firebaseUser.email || '',
          role: intendedRole || 'candidate',
          phone: firebaseUser.phoneNumber || '',
          location: 'Update Location'
        };
        
        await setDoc(userDocRef, newUser);
        const completeUser = { id: firebaseUser.uid, ...newUser };
        setUser(completeUser);
        return completeUser;
      }
    } catch (error: any) {
      if (error && error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        handleFirestoreError(error, OperationType.WRITE, 'users');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, isLoading }}>
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
