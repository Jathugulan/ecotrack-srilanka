import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types.js';
import { api } from '../api/client.js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  quickLoginAsRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('ecotrack_token');
    const savedUser = localStorage.getItem('ecotrack_user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ecotrack_token');
        localStorage.removeItem('ecotrack_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('ecotrack_token', token);
    localStorage.setItem('ecotrack_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ecotrack_token');
    localStorage.removeItem('ecotrack_user');
    setUser(null);
  };

  // Demo helper: allows instant switching between the seeded personas
  const quickLoginAsRole = async (role: UserRole) => {
    const credentialsMap: Record<UserRole, { email: string; pass: string }> = {
      RESIDENT: { email: 'resident@ecotrack.lk', pass: 'Password123!' },
      MUNICIPAL_OFFICER: { email: 'officer@colombo.mc.gov.lk', pass: 'Password123!' },
      COLLECTION_WORKER: { email: 'worker@colombo.mc.gov.lk', pass: 'Password123!' },
      DRIVER: { email: 'driver@colombo.mc.gov.lk', pass: 'Password123!' },
      RECYCLING_PARTNER: { email: 'partner@ecospindles.lk', pass: 'Password123!' },
      SYSTEM_ADMIN: { email: 'admin@ecotrack.lk', pass: 'Password123!' },
    };

    const target = credentialsMap[role];
    if (target) {
      const res = await api.post('/auth/login', {
        email: target.email,
        password: target.pass,
      });
      if (res.data.success) {
        login(res.data.data.accessToken, res.data.data.user);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, quickLoginAsRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
