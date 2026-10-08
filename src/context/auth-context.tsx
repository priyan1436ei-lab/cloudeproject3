'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AuthUser,
  DEMO_USER,
  DEMO_ADMIN,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logoutUser,
  resetUserPassword,
  mapFirebaseUser,
} from '@/lib/firebase/auth';
import { auth, isLiveFirebaseConfigured } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  loginDemo: (role?: 'user' | 'admin') => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  loginGoogle: async () => {},
  loginDemo: () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Try Live Firebase listener if active
    if (isLiveFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(mapFirebaseUser(firebaseUser));
        } else {
          // Check local stored demo user
          checkLocalSession();
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      checkLocalSession();
      setLoading(false);
    }
  }, []);

  const checkLocalSession = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('documind_auth_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(DEMO_USER);
        }
      } else {
        // Automatically provide demo user for seamless zero-barrier evaluation!
        setUser(DEMO_USER);
        localStorage.setItem('documind_auth_user', JSON.stringify(DEMO_USER));
      }
    }
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const u = await loginWithEmail(email, pass);
      setUser(u);
      localStorage.setItem('documind_auth_user', JSON.stringify(u));
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const u = await registerWithEmail(email, pass, name);
      setUser(u);
      localStorage.setItem('documind_auth_user', JSON.stringify(u));
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const u = await loginWithGoogle();
      setUser(u);
      localStorage.setItem('documind_auth_user', JSON.stringify(u));
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = (role: 'user' | 'admin' = 'user') => {
    const target = role === 'admin' ? DEMO_ADMIN : DEMO_USER;
    setUser(target);
    localStorage.setItem('documind_auth_user', JSON.stringify(target));
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem('documind_auth_user');
  };

  const resetPassword = async (email: string) => {
    await resetUserPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginGoogle,
        loginDemo,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
