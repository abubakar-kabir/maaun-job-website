/* eslint-disable react-refresh/only-export-components -- AuthProvider + useAuth */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'maaun_auth_role';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'employee' || stored === 'employer') return stored;
    return null;
  });

  const login = useCallback((nextRole) => {
    setRole(nextRole);
    sessionStorage.setItem(STORAGE_KEY, nextRole);
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      role,
      isEmployee: role === 'employee',
      isEmployer: role === 'employer',
      login,
      logout,
    }),
    [role, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
