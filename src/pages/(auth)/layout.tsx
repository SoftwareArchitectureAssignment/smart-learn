import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import { navigate } from "@/lib/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function AuthLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    }
  }, [user, navigate]);

  return <Outlet />;
}
