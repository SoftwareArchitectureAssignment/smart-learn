import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { navigate } from "@/lib/navigation";
import Sidebar from "@/components/shared/sidebar";

export default function StudentLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== "STUDENT") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
