import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  email: string;
  companyName?: string;
  companySize?: string;
  industry?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (data: SignupData) => boolean;
  logout: () => void;
}

interface SignupData {
  companyName: string;
  companySize: string;
  industry: string;
  email: string;
  phone: string;
  country: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('irecruit_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, password: string) => {
    // Accept any combination of email and password
    if (email && password) {
      const userData = { email, companyName: 'Demo Company' };
      setUser(userData);
      localStorage.setItem('irecruit_user', JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((data: SignupData) => {
    const userData = {
      email: data.email,
      companyName: data.companyName,
      companySize: data.companySize,
      industry: data.industry,
    };
    setUser(userData);
    localStorage.setItem('irecruit_user', JSON.stringify(userData));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('irecruit_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
