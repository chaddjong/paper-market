import { User } from '@supabase/supabase-js'; // Hapus Session dari import jika tidak dipakai sebagai type eksplisit
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

type Role = 'customer' | 'admin' | null;

interface AuthContextType {
  role: Role;
  user: User | null;
  userData: any | null;
  loading: boolean;
  setRole: (role: Role) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  user: null,
  userData: null,
  loading: true,
  setRole: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      setUserData(data);
      setRole(data.role as Role);
    }
  };

  useEffect(() => {
    // 1. Cek session saat awal aplikasi dibuka
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await fetchUserData(session.user.id);
      }
      setLoading(false);
    };

    initializeAuth();

    // 2. Listen perubahan auth (login/logout)
    // Gunakan _event karena variabel tersebut tidak kita pakai di dalam scope
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        } else {
          setUser(null);
          setUserData(null);
          setRole(null);
        }
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ role, user, userData, loading, setRole, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
