import type { Course } from "@/data/courses";
import { useState } from "react";
import { Search, Mail, Phone, Calendar, TrendingUp, Award, Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledDate: Date;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastActive: Date;
  grade: number;
  avatar: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    phone: "0901234567",
    enrolledDate: new Date(2025, 8, 1),
    progress: 85,
    completedLessons: 17,
    totalLessons: 20,
    lastActive: new Date(2025, 10, 5),
    grade: 92,
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=4F46E5&color=fff",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "tranthibinh@example.com",
    phone: "0907654321",
    enrolledDate: new Date(2025, 8, 5),
    progress: 60,
    completedLessons: 12,
    totalLessons: 20,
    lastActive: new Date(2025, 10, 6),
    grade: 88,
    avatar: "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=EC4899&color=fff",
  },
  {
    id: "3",
    name: "Lê Hoàng Cường",
    email: "lehoangcuong@example.com",
    phone: "0912345678",
    enrolledDate: new Date(2025, 8, 10),
    progress: 45,
    completedLessons: 9,
    totalLessons: 20,
    lastActive: new Date(2025, 10, 4),
    grade: 75,
    avatar: "https://ui-avatars.com/api/?name=Le+Hoang+Cuong&background=10B981&color=fff",
  },
  {
    id: "4",
    name: "Phạm Thị Diễm",
    email: "phamthidiem@example.com",
    phone: "0923456789",
    enrolledDate: new Date(2025, 8, 15),
    progress: 95,
    completedLessons: 19,
    totalLessons: 20,
    lastActive: new Date(2025, 10, 6),
    grade: 98,
    avatar: "https://ui-avatars.com/api/?name=Pham+Thi+Diem&background=F59E0B&color=fff",
  },
  {
    id: "5",
    name: "Hoàng Văn Em",
    email: "hoangvanem@example.com",
    phone: "0934567890",
    enrolledDate: new Date(2025, 9, 1),
    progress: 30,
    completedLessons: 6,
    totalLessons: 20,
    lastActive: new Date(2025, 10, 3),
    grade: 65,
    avatar: "https://ui-avatars.com/api/?name=Hoang+Van+Em&background=EF4444&color=fff",
  },
];

interface CourseStudentsProps {
  course: Course;
}

export default function CourseStudents({}: CourseStudentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "grade">("name");

  const filteredStudents = mockStudents
    .filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return b.progress - a.progress;
        case "grade":
          return b.grade - a.grade;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const avgProgress = mockStudents.reduce((acc, student) => acc + student.progress, 0) / mockStudents.length;
  const avgGrade = mockStudents.reduce((acc, student) => acc + student.grade, 0) / mockStudents.length;
  const activeStudents = mockStudents.filter(
    (s) => new Date().getTime() - s.lastActive.getTime() < 7 * 24 * 60 * 60 * 1000,
  ).length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-7xl">
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Tổng học viên</p>
              <p className="text-2xl font-bold text-gray-900">{mockStudents.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Tiến độ TB</p>
              <p className="text-2xl font-bold text-gray-900">{avgProgress.toFixed(0)}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Điểm TB</p>
              <p className="text-2xl font-bold text-gray-900">{avgGrade.toFixed(1)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
              <CheckCircle2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm học viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant={sortBy === "name" ? "default" : "outline"} size="sm" onClick={() => setSortBy("name")}>
              Tên
            </Button>
            <Button
              variant={sortBy === "progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("progress")}
            >
              Tiến độ
            </Button>
            <Button variant={sortBy === "grade" ? "default" : "outline"} size="sm" onClick={() => setSortBy("grade")}>
              Điểm số
            </Button>
          </div>
        </div>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">Không tìm thấy học viên nào</p>
          </Card>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student.id} className="p-6 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <img src={student.avatar} alt={student.name} className="h-16 w-16 rounded-full" />

                {/* Info */}
                <div className="flex-1">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-bold text-gray-900">{student.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {student.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {student.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Đăng ký: {formatDate(student.enrolledDate)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="mb-1 text-sm text-gray-600">Điểm số</p>
                      <p className={`text-2xl font-bold ${getGradeColor(student.grade)}`}>{student.grade}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Tiến độ: {student.completedLessons}/{student.totalLessons} bài học
                      </span>
                      <span className="font-semibold text-gray-900">{student.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(student.progress)}`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Hoạt động gần nhất: {formatDate(student.lastActive)}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
