// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// point this at your json-server
const API = 'http://localhost:4000';
const STORAGE_KEY = 'authUser';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // on mount, rehydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // login returns the “me” object so your Login.jsx can immediately route
  async function login(identifier, password) {
    // try by email
    let res = await fetch(
      `${API}/users?email=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}`
    );
    if (!res.ok) throw new Error('Network error');
    let list = await res.json();

    // if none, try by username
    if (!Array.isArray(list) || list.length === 0) {
      res = await fetch(
        `${API}/users?username=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}`
      );
      if (!res.ok) throw new Error('Network error');
      list = await res.json();
    }

    if (!Array.isArray(list) || list.length === 0) {
      throw new Error('Invalid credentials');
    }

    const u = list[0];
    const me = {
      email: u.email,
      role:  u.role,
      ...(u.companyId && { companyId: u.companyId }),
      ...(u.agencyId  && { agencyId:  u.agencyId  }),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(me));
    setUser(me);
    return me;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
