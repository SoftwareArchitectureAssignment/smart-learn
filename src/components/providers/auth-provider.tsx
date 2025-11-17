"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { IUser } from "@/types/user.type";
import { registerApi } from "@/apis/auth/register";
import { loginApi } from "@/apis/auth/login";
import { updateProfileApi } from "@/apis/auth/update-profile.api";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  register: (email: string, name: string, password: string, phoneNumber: string, role: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: { id: string; fullname?: string; email?: string; avatarUrl?: string }) => Promise<void>;
}

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/not-found"];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  const hasGetUser = useRef(false);

  const refreshUser = useCallback(async () => {
    setLoading(true);

    setLoading(false);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (!PUBLIC_ROUTES.includes(location.pathname)) {
        if (hasGetUser.current) return;

        hasGetUser.current = true;
        await refreshUser();
      }
    };

    checkAuth();
  }, [location.pathname, navigate, refreshUser]);

  const register = async (email: string, name: string, password: string, phoneNumber: string, role: string) => {
    setLoading(true);
    const [res, err] = await registerApi({ email, name, password, phoneNumber, role });

    if (err) {
      toast.error("Registration failed", {
        description: err.message,
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    toast.success("Registration successful", {
      description: res.message,
      duration: 3000,
    });

    localStorage.setItem("accessToken", res.data.accessToken);
    setUser({ ...res.data.user, accessToken: res.data.accessToken });
    setLoading(false);

    navigate("/dashboard");
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    const [res, err] = await loginApi({ email, password });

    if (err) {
      toast.error("Login failed", {
        description: err.message,
        duration: 3000,
      });

      setLoading(false);
      return;
    }

    toast.success("Login successful", {
      description: res.message,
      duration: 3000,
    });

    localStorage.setItem("accessToken", res.data.accessToken);
    setUser({ ...res.data.user, accessToken: res.data.accessToken });
    setLoading(false);

    navigate("/dashboard");
  };

  const logout = async () => {
    setLoading(true);

    localStorage.removeItem("accessToken");
    setUser(null);
    setLoading(false);

    navigate("/login");
  };

  const updateUser = async (data: {
    id: string;
    email?: string;
    name?: string;
    password?: string;
    phoneNumber?: string;
    role?: string;
  }) => {
    setLoading(true);
    const [res, err] = await updateProfileApi(data);

    if (err) {
      toast.error("Update failed", {
        description: err.message,
        duration: 3000,
      });

      return;
    }

    toast.success("Update successful", {
      description: res.message,
      duration: 3000,
    });

    setUser(res.data.user);
    setLoading(false);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
