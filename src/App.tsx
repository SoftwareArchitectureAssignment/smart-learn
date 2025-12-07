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
import TeacherDashboard from "@/pages/(private)/teacher/dashboard";
import TeacherCourses from "@/pages/(private)/teacher/courses";
import CourseDetail from "@/pages/(private)/teacher/courses/[id]";
import TeacherReports from "@/pages/(private)/teacher/reports";
import TeacherSettings from "@/pages/(private)/teacher/settings";

import StudentLayout from "@/pages/(private)/student/layout";
import StudentDashboard from "@/pages/(private)/student/dashboard";
import StudentCourses from "@/pages/(private)/student/courses";
import CourseLearn from "@/pages/(private)/student/courses/[id]/learn";
import LearningPaths from "@/pages/(private)/student/learning-paths";
import PlacementTest from "@/pages/(private)/student/placement-test";
import TakeTest from "@/pages/(private)/student/placement-test/take-test";
import TestResult from "@/pages/(private)/student/placement-test/result";
import StudentSettings from "@/pages/(private)/student/settings";

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
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="courses" element={<TeacherCourses />} />
              <Route path="courses/:id/*" element={<CourseDetail />} />
              <Route path="reports" element={<TeacherReports />} />
              <Route path="settings" element={<TeacherSettings />} />
            </Route>
            <Route path="student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="courses/:id/learn" element={<CourseLearn />} />
              <Route path="learning-paths" element={<LearningPaths />} />
              <Route path="placement-test" element={<PlacementTest />} />
              <Route path="placement-test/take" element={<TakeTest />} />
              <Route path="placement-test/result" element={<TestResult />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TanstackProvider>
  );
}

export default App;
