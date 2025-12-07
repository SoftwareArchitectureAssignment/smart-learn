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

  const course = mockCourses.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Không tìm thấy khóa học</h2>
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
        <div className="sticky top-0 z-10 border-b bg-white">
          <div className="px-8 py-4">
            <button
              onClick={() => navigate("/teacher/courses")}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Quay lại danh sách khóa học</span>
            </button>

            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="mb-1 text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
              {course.instructor && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Giảng viên</p>
                  <p className="font-semibold text-gray-900">{course.instructor}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <nav className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    className={`flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                      tab.active
                        ? "border-b-2 border-blue-600 bg-gray-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
