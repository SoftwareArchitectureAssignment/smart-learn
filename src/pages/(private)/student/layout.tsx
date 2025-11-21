import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { navigate } from "@/lib/navigation";

export default function StudentLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== "STUDENT") {
      navigate("/");
    }
  }, [user, navigate]);

  return <Outlet />;
}
