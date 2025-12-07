import { useState } from "react";
import { BookOpen, Users, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ICourse } from "@/types/course.type";
import type { StudentProgress } from "@/types/learning-path.type";

const MyCourses = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"ALL" | "IN_PROGRESS" | "COMPLETED">("ALL");

  // Mock data - replace with actual API call
  const courses: (ICourse & { progress: StudentProgress })[] = [
    {
      id: 1,
      title: "Introduction to React",
      description: "Learn the basics of React and build modern web applications",
      instructor: "John Doe",
      thumbnail: "https://via.placeholder.com/400x200",
      createdAt: "2024-01-15",
      sections: [],
      progress: {
        courseId: "1",
        courseName: "Introduction to React",
        progress: 75,
        lastAccessed: "2 hours ago",
        status: "IN_PROGRESS",
      },
    },
    {
      id: 2,
      title: "Advanced TypeScript",
      description: "Master TypeScript with advanced patterns and techniques",
      instructor: "Jane Smith",
      thumbnail: "https://via.placeholder.com/400x200",
      createdAt: "2024-01-20",
      sections: [],
      progress: {
        courseId: "2",
        courseName: "Advanced TypeScript",
        progress: 30,
        lastAccessed: "1 day ago",
        status: "IN_PROGRESS",
      },
    },
    {
      id: 3,
      title: "Node.js Fundamentals",
      description: "Build scalable backend applications with Node.js",
      instructor: "Mike Johnson",
      thumbnail: "https://via.placeholder.com/400x200",
      createdAt: "2024-01-10",
      sections: [],
      progress: {
        courseId: "3",
        courseName: "Node.js Fundamentals",
        progress: 100,
        lastAccessed: "3 days ago",
        status: "COMPLETED",
      },
    },
  ];

  const filteredCourses = courses.filter((course) => {
    if (filter === "ALL") return true;
    return course.progress.status === filter;
  });

  const handleStartCourse = (courseId: number) => {
    navigate(`/student/courses/${courseId}/learn`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-gray-500">Continue learning or start a new course</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "ALL" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All Courses ({courses.length})
        </button>
        <button
          onClick={() => setFilter("IN_PROGRESS")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "IN_PROGRESS" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          In Progress ({courses.filter((c) => c.progress.status === "IN_PROGRESS").length})
        </button>
        <button
          onClick={() => setFilter("COMPLETED")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "COMPLETED" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Completed ({courses.filter((c) => c.progress.status === "COMPLETED").length})
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative">
              <img src={course.thumbnail} alt={course.title} className="h-48 w-full object-cover" />
              {course.progress.status === "COMPLETED" && (
                <div className="absolute top-2 right-2 rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
                  Completed
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <p className="line-clamp-2 text-sm text-gray-500">{course.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="size-4" />
                  <span>{course.instructor}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{course.progress.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${course.progress.progress}%` }}
                  />
                </div>
              </div>

              <Button
                onClick={() => handleStartCourse(course.id)}
                className="w-full"
                variant={course.progress.status === "COMPLETED" ? "outline" : "default"}
              >
                <Play className="mr-2 size-4" />
                {course.progress.status === "COMPLETED" ? "Review Course" : "Continue Learning"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto mb-4 size-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No courses found</h3>
          <p className="text-gray-500">
            {filter === "ALL"
              ? "You haven't enrolled in any courses yet"
              : `You don't have any ${filter.toLowerCase().replace("_", " ")} courses`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
