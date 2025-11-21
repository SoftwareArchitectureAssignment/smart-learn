import { createContext, type ReactNode, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { navigate } from "@/lib/navigation";
import type { IUser } from "@/types/user.type";
import { authApi } from "@/apis/auth/auth.api";
import { registerApi } from "@/apis/auth/register.api";
import { loginApi } from "@/apis/auth/login.api";
import { updateProfileApi } from "@/apis/auth/update-profile.api";
import LoadingScreen from "@/components/shared/loading-screen";

interface AuthContextType {
  user: IUser | null;
  isGettingUser: boolean;

  register: (data: {
    email: string;
    name: string;
    password: string;
    phone: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
  }) => Promise<void>;
  isRegistering: boolean;

  login: (data: { email: string; password: string }) => Promise<void>;
  isLoggingIn: boolean;

  logout: () => Promise<void>;
  isLoggingOut: boolean;

  updateProfile: (data: {
    email?: string;
    name?: string;
    password?: string;
    phone?: string;
    role?: "STUDENT" | "TEACHER" | "ADMIN";
  }) => Promise<void>;
  isUpdatingProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isGettingUser } = useQuery<IUser>({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await authApi();
      return res.toUser();
    },
    retry: false,
  });

  const register = useMutation({
    mutationFn: async (data: {
      email: string;
      name: string;
      password: string;
      phone: string;
      role: "STUDENT" | "TEACHER" | "ADMIN";
    }) => {
      const res = await registerApi({
        email: data.email,
        name: data.name,
        password: data.password,
        phoneNumber: data.phone,
        role: data.role,
      });

      toast.success("Registration successful", {
        description: res.message,
        duration: 3000,
      });

      const user = res.toUser();
      queryClient.setQueryData(["auth"], user);
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    },
    onError: (error: any) => {
      toast.error("Registration failed", {
        description: error.response?.data?.message || error.message,
        duration: 3000,
      });
    },
  });

  const login = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await loginApi({
        email: data.email,
        password: data.password,
      });

      toast.success("Login successful", {
        description: res.message,
        duration: 3000,
      });

      const user = res.toUser();
      queryClient.setQueryData(["auth"], user);
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    },
    onError: (error: any) => {
      toast.error("Login failed", {
        description: error.response?.data?.message || error.message,
        duration: 3000,
      });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      toast.success("Logout successful", { duration: 3000 });
      queryClient.removeQueries();
      localStorage.removeItem("accessToken");
      navigate("/login");
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: {
      email?: string;
      name?: string;
      password?: string;
      phone?: string;
      role?: "STUDENT" | "TEACHER" | "ADMIN";
    }) => {
      const res = await updateProfileApi(data);

      toast.success("Update successful", {
        description: res.message,
        duration: 3000,
      });

      queryClient.setQueryData(["auth"], res.toUser());
    },
    onError: (error: any) => {
      toast.error("Update failed", {
        description: error.response?.data?.message || error.message,
        duration: 3000,
      });
    },
  });

  const value = {
    user: user || null,
    isGettingUser,
    register: register.mutateAsync,
    isRegistering: register.isPending,
    login: login.mutateAsync,
    isLoggingIn: login.isPending,
    logout: logout.mutateAsync,
    isLoggingOut: logout.isPending,
    updateProfile: updateProfile.mutateAsync,
    isUpdatingProfile: updateProfile.isPending,
  };

  return <AuthContext.Provider value={value}>{isGettingUser ? <LoadingScreen /> : children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
