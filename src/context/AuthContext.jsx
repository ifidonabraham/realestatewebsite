'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and set the user
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (_event === 'SIGNED_IN') toast.success('Welcome back!');
      if (_event === 'SIGNED_OUT') toast.info('Signed out successfully');
    });

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    signUp: async (data) => {
      const res = await supabase.auth.signUp(data);
      if (res.error) toast.error(res.error.message);
      else toast.success('Registration successful! Check your email.');
      return res;
    },
    signIn: async (data) => {
      const res = await supabase.auth.signInWithPassword(data);
      if (res.error) toast.error(res.error.message);
      return res;
    },
    signOut: async () => {
      const res = await supabase.auth.signOut();
      if (res.error) toast.error(res.error.message);
      return res;
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
