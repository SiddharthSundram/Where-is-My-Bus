"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Load token & user on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === "ADMIN");
    }
  }, []);

  // ✅ Login function
  const login = (token: string, userData?: User) => {
    localStorage.setItem("token", token);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(userData.role === "ADMIN");
    } else {
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("user", JSON.stringify(payload));
      setUser(payload);
      setIsAdmin(payload.role === "ADMIN");
    }

    setIsAuthenticated(true);
  };

  // ✅ Logout function with redirect
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);

    // 🔄 Redirect to login page after logout 
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook to access AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
