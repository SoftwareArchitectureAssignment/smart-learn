import { useParams, useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/components/shared/sidebar";
import { mockCourses } from "@/data/courses";
import { ArrowLeft, BookOpen, Users, Settings as SettingsIcon } from "lucide-react";
import CourseContent from "./content.tsx";
import CourseStudents from "./students.tsx";
import CourseSettings from "./settings.tsx";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h2>
          <button onClick={() => navigate("/courses")} className="text-blue-600 hover:text-blue-700">
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  const currentPath = location.pathname;
  const isContentTab = currentPath === `/courses/${id}` || currentPath === `/courses/${id}/content`;
  const isStudentsTab = currentPath === `/courses/${id}/students`;
  const isSettingsTab = currentPath === `/courses/${id}/settings`;

  const tabs = [
    {
      name: "Nội dung",
      path: `/courses/${id}/content`,
      icon: BookOpen,
      active: isContentTab,
    },
    {
      name: "Học viên",
      path: `/courses/${id}/students`,
      icon: Users,
      active: isStudentsTab,
    },
    {
      name: "Cài đặt",
      path: `/courses/${id}/settings`,
      icon: SettingsIcon,
      active: isSettingsTab,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="px-8 py-4">
            <button
              onClick={() => navigate("/courses")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Quay lại danh sách khóa học</span>
            </button>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.title}</h1>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  course.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : course.status === "Draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {course.status}
              </span>
            </div>

            {/* Tabs */}
            <nav className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      tab.active
                        ? "bg-gray-50 text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <Routes>
            <Route index element={<Navigate to="content" replace />} />
            <Route path="content" element={<CourseContent course={course} />} />
            <Route path="students" element={<CourseStudents course={course} />} />
            <Route path="settings" element={<CourseSettings course={course} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
