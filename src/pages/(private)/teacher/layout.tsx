import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { navigate } from "@/lib/navigation";

export default function TeacherLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== "TEACHER") {
      navigate("/");
    }
  }, [user, navigate]);

  return <Outlet />;
}
