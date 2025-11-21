import Sidebar from "@/components/shared/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/data/courses";
import { BookOpen, Users, Clock, Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const navigate = useNavigate();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">Khóa học</h1>
              <p className="text-gray-600">Quản lý và theo dõi tất cả các khóa học</p>
            </div>
            <Button className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Thêm khóa học mới
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tổng khóa học</CardDescription>
                <CardTitle className="text-3xl">{mockCourses.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tổng học viên</CardDescription>
                <CardTitle className="text-3xl">
                  {mockCourses.reduce((acc, course) => acc + course.students, 0).toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Đánh giá trung bình</CardDescription>
                <CardTitle className="text-3xl">
                  {(mockCourses.reduce((acc, course) => acc + course.rating, 0) / mockCourses.length).toFixed(1)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Khóa học hoạt động</CardDescription>
                <CardTitle className="text-3xl">{mockCourses.filter((c) => c.status === "Active").length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Course List */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <span
                    className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold ${getLevelColor(
                      course.level,
                    )}`}
                  >
                    {course.level}
                  </span>
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
                      {course.category}
                    </span>
                    <span className="text-lg font-bold text-gray-900">${course.price}</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-xl">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()} học viên</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">{course.status}</span>
                      </div>
                    </div>
                    <div className="border-t pt-2 text-sm text-gray-600">
                      <span className="font-medium">Giảng viên:</span> {course.instructor}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        Chi tiết
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => navigate(`/courses/${course.id}/settings`)}>
                        Chỉnh sửa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
