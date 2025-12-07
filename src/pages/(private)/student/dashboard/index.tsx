import { BookOpen, TrendingUp, Clock, Award } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentProgress } from "@/types/learning-path.type";

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data - replace with actual API call
  const stats = {
    enrolledCourses: 5,
    completedCourses: 2,
    inProgressCourses: 3,
    totalLearningHours: 47,
  };

  const recentCourses: StudentProgress[] = [
    {
      courseId: "1",
      courseName: "Introduction to React",
      progress: 75,
      lastAccessed: "2 hours ago",
      status: "IN_PROGRESS",
    },
    {
      courseId: "2",
      courseName: "Advanced TypeScript",
      progress: 30,
      lastAccessed: "1 day ago",
      status: "IN_PROGRESS",
    },
    {
      courseId: "3",
      courseName: "Node.js Fundamentals",
      progress: 100,
      lastAccessed: "3 days ago",
      status: "COMPLETED",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="mt-1 text-gray-500">Continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Enrolled Courses</CardTitle>
            <BookOpen className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            <TrendingUp className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            <Award className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Learning Hours</CardTitle>
            <Clock className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLearningHours}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div
                key={course.courseId}
                className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{course.courseName}</h3>
                  <p className="text-sm text-gray-500">Last accessed {course.lastAccessed}</p>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                    </div>
                  </div>
                </div>
                {course.status === "COMPLETED" && <Award className="size-6 text-green-500" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
