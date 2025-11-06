import Sidebar from "@/components/shared/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  course: string;
  type: "quiz" | "assignment";
  dueDate: Date;
  status: "upcoming" | "due-soon" | "overdue";
  description: string;
  points: number;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Bài kiểm tra giữa kỳ",
    course: "Web Development Fundamentals",
    type: "quiz",
    dueDate: new Date(2025, 10, 8, 14, 0), // Nov 8, 2025, 2:00 PM
    status: "due-soon",
    description: "Kiểm tra kiến thức HTML, CSS, JavaScript cơ bản",
    points: 100,
  },
  {
    id: "2",
    title: "Bài tập React Hooks",
    course: "Advanced React & TypeScript",
    type: "assignment",
    dueDate: new Date(2025, 10, 10, 23, 59), // Nov 10, 2025, 11:59 PM
    status: "upcoming",
    description: "Xây dựng ứng dụng quản lý todo sử dụng React Hooks",
    points: 50,
  },
  {
    id: "3",
    title: "Quiz Python Basics",
    course: "Python for Data Science",
    type: "quiz",
    dueDate: new Date(2025, 10, 7, 10, 0), // Nov 7, 2025, 10:00 AM
    status: "overdue",
    description: "Câu hỏi trắc nghiệm về cú pháp Python cơ bản",
    points: 30,
  },
  {
    id: "4",
    title: "Thiết kế giao diện đăng nhập",
    course: "UI/UX Design Principles",
    type: "assignment",
    dueDate: new Date(2025, 10, 12, 23, 59), // Nov 12, 2025, 11:59 PM
    status: "upcoming",
    description: "Thiết kế màn hình đăng nhập theo Material Design",
    points: 40,
  },
  {
    id: "5",
    title: "Bài tập REST API",
    course: "Node.js Backend Development",
    type: "assignment",
    dueDate: new Date(2025, 10, 9, 18, 0), // Nov 9, 2025, 6:00 PM
    status: "due-soon",
    description: "Xây dựng REST API cho hệ thống quản lý sách",
    points: 60,
  },
  {
    id: "6",
    title: "Quiz Flutter Widgets",
    course: "Mobile App Development with Flutter",
    type: "quiz",
    dueDate: new Date(2025, 10, 15, 16, 0), // Nov 15, 2025, 4:00 PM
    status: "upcoming",
    description: "Kiểm tra kiến thức về các widget cơ bản trong Flutter",
    points: 25,
  },
  {
    id: "7",
    title: "Data Visualization Project",
    course: "Python for Data Science",
    type: "assignment",
    dueDate: new Date(2025, 10, 11, 23, 59), // Nov 11, 2025, 11:59 PM
    status: "upcoming",
    description: "Tạo biểu đồ phân tích dữ liệu bằng Matplotlib và Seaborn",
    points: 80,
  },
  {
    id: "8",
    title: "Kiểm tra TypeScript",
    course: "Advanced React & TypeScript",
    type: "quiz",
    dueDate: new Date(2025, 10, 8, 9, 0), // Nov 8, 2025, 9:00 AM
    status: "due-soon",
    description: "Câu hỏi về Types, Interfaces, và Generics",
    points: 35,
  },
];

export default function Reports() {
  const [filter, setFilter] = useState<"all" | "quiz" | "assignment">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "due-soon" | "overdue">("all");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesType = filter === "all" || event.type === filter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "due-soon":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: Event["status"]) => {
    switch (status) {
      case "overdue":
        return "Quá hạn";
      case "due-soon":
        return "Sắp đến hạn";
      case "upcoming":
        return "Sắp tới";
      default:
        return "";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diff < 0) {
      return `Quá hạn ${Math.abs(days)} ngày`;
    } else if (days === 0) {
      return `Còn ${hours} giờ`;
    } else if (days === 1) {
      return "Ngày mai";
    } else {
      return `Còn ${days} ngày`;
    }
  };

  const stats = {
    total: mockEvents.length,
    upcoming: mockEvents.filter((e) => e.status === "upcoming").length,
    dueSoon: mockEvents.filter((e) => e.status === "due-soon").length,
    overdue: mockEvents.filter((e) => e.status === "overdue").length,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sự kiện & Deadline</h1>
            <p className="text-gray-600">Theo dõi các quiz và bài tập sắp tới hạn của bạn</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng số sự kiện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Sắp tới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.upcoming}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Sắp đến hạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{stats.dueSoon}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Quá hạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">Loại:</span>
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilter("quiz")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "quiz" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Quiz
                </button>
                <button
                  onClick={() => setFilter("assignment")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "assignment" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Bài tập
                </button>
              </div>

              <div className="h-6 w-px bg-gray-300" />

              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setStatusFilter("upcoming")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "upcoming"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Sắp tới
                </button>
                <button
                  onClick={() => setStatusFilter("due-soon")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "due-soon"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Sắp đến hạn
                </button>
                <button
                  onClick={() => setStatusFilter("overdue")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "overdue"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Quá hạn
                </button>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">Không có sự kiện nào phù hợp với bộ lọc</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              event.status,
                            )}`}
                          >
                            {getStatusText(event.status)}
                          </span>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              event.type === "quiz"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : "bg-green-100 text-green-800 border-green-200"
                            }`}
                          >
                            {event.type === "quiz" ? "📝 Quiz" : "📋 Bài tập"}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>

                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            <span className="font-medium">{event.course}</span>
                          </div>

                          <div className="h-4 w-px bg-gray-300" />

                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                            <span>{event.points} điểm</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div className="text-sm text-gray-500 mb-1">
                          {event.dueDate.toLocaleDateString("vi-VN", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-lg font-bold text-gray-700">
                          {event.dueDate.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div
                          className={`text-sm font-semibold mt-1 ${
                            event.status === "overdue"
                              ? "text-red-600"
                              : event.status === "due-soon"
                                ? "text-orange-600"
                                : "text-blue-600"
                          }`}
                        >
                          {formatDate(event.dueDate)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
