import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Clock } from "lucide-react";

import Sidebar from "@/components/shared/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockCourses } from "@/data/courses";
import type { ICourse } from "@/types/course.type";
import { useCourse } from "@/hooks/useCourse";

export default function Courses() {
  const { courses: test } = useCourse();
  console.log(test);

  const navigate = useNavigate();
  const [courses, setCourses] = useState<ICourse[]>(mockCourses);
  const [isLoadingCourses] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCourseTitle.trim() || !newCourseDescription.trim()) {
      return;
    }

    setIsCreatingCourse(true);

    // Simulate API call
    setTimeout(() => {
      const newCourse: ICourse = {
        id: Date.now(),
        title: newCourseTitle,
        description: newCourseDescription,
        createdAt: new Date().toISOString(),
        sections: [],
      };

      setCourses([...courses, newCourse]);
      setIsDialogOpen(false);
      setNewCourseTitle("");
      setNewCourseDescription("");
      setIsCreatingCourse(false);
    }, 500);
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tạo khóa học mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <form onSubmit={handleCreateCourse}>
                  <DialogHeader>
                    <DialogTitle>Tạo khóa học mới</DialogTitle>
                    <DialogDescription>
                      Nhập thông tin cơ bản cho khóa học của bạn. Bạn có thể chỉnh sửa chi tiết sau.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Tên khóa học</Label>
                      <Input
                        id="title"
                        placeholder="Ví dụ: Lập trình React từ cơ bản đến nâng cao"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea
                        id="description"
                        placeholder="Mô tả ngắn về khóa học..."
                        value={newCourseDescription}
                        onChange={(e) => setNewCourseDescription(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isCreatingCourse}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" disabled={isCreatingCourse}>
                      {isCreatingCourse ? "Đang tạo..." : "Tạo khóa học"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tổng khóa học</CardDescription>
                <CardTitle className="text-3xl">{courses.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Khóa học hoạt động</CardDescription>
                <CardTitle className="text-3xl">{courses.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tổng học viên</CardDescription>
                <CardTitle className="text-3xl">0</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Đánh giá trung bình</CardDescription>
                <CardTitle className="text-3xl">-</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Loading State */}
          {isLoadingCourses && (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Đang tải khóa học...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingCourses && courses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <BookOpen className="mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Chưa có khóa học nào</h3>
              <p className="mb-4 text-gray-500">Bắt đầu bằng cách tạo khóa học đầu tiên của bạn</p>
              <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tạo khóa học mới
              </Button>
            </div>
          )}

          {/* Course List */}
          {!isLoadingCourses && courses.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-blue-400 to-indigo-600">
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-20 w-20 text-white opacity-50" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-xl">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(course.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/teacher/courses/${course.id}`)}
                        >
                          Chi tiết
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/teacher/courses/${course.id}/settings`)}
                        >
                          Chỉnh sửa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
