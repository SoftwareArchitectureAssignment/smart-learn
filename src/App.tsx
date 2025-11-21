import { useNavigate, Routes, Route } from "react-router-dom";

import { setNavigator } from "@/lib/navigation";
import TanstackProvider from "@/components/providers/tanstack-provider.tsx";
import AuthProvider from "@/components/providers/auth-provider.tsx";

import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

import AuthLayout from "@/pages/(auth)/layout";
import Login from "@/pages/(auth)/login";
import Register from "@/pages/(auth)/register";

import AuthenticatedLayout from "@/pages/(private)/layout";

import TeacherLayout from "@/pages/(private)/teacher/layout";
import Dashboard from "@/pages/(private)/teacher/dashboard";
import Courses from "@/pages/(private)/teacher/courses";
import CourseDetail from "@/pages/(private)/teacher/courses/[id]";
import Reports from "@/pages/(private)/teacher/reports";
import Settings from "@/pages/(private)/teacher/settings";

import StudentLayout from "@/pages/(private)/student/layout";

function App() {
  const navigate = useNavigate();
  setNavigator(navigate);

  return (
    <TanstackProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route element={<AuthenticatedLayout />}>
            <Route path="teacher" element={<TeacherLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id/*" element={<CourseDetail />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="student" element={<StudentLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TanstackProvider>
  );
}

export default App;
