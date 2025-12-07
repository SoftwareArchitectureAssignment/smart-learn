import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, TrendingUp, ArrowRight, Play, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LearningPath } from "@/types/learning-path.type";
import type { ICourse } from "@/types/course.type";

interface EnrolledPath extends LearningPath {
  enrolledAt: string;
  progress: number;
  coursesCompleted: number;
}

const LearningPaths = () => {
  const navigate = useNavigate();

  // Mock enrolled learning paths - replace with actual API call
  const enrolledPaths: EnrolledPath[] = [
    {
      id: "1",
      title: "Frontend Development Path",
      description: "Master modern frontend development with React, TypeScript, and more",
      level: "BEGINNER",
      duration: "6 months",
      totalCourses: 8,
      courses: [
        {
          id: 1,
          title: "HTML & CSS Fundamentals",
          description: "Learn the basics of web development",
          createdAt: "2024-01-15",
          sections: [],
        },
        {
          id: 2,
          title: "JavaScript Essentials",
          description: "Master JavaScript programming",
          createdAt: "2024-01-15",
          sections: [],
        },
        {
          id: 3,
          title: "Introduction to React",
          description: "Build modern web apps with React",
          createdAt: "2024-01-15",
          sections: [],
        },
      ] as ICourse[],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      enrolledAt: "2024-11-01",
      progress: 37.5, // 3 out of 8 courses
      coursesCompleted: 3,
    },
    {
      id: "2",
      title: "Full Stack JavaScript",
      description: "Become a full-stack developer with Node.js, React, and databases",
      level: "INTERMEDIATE",
      duration: "9 months",
      totalCourses: 12,
      courses: [
        {
          id: 4,
          title: "Advanced React Patterns",
          description: "Learn advanced React concepts",
          createdAt: "2024-01-15",
          sections: [],
        },
        {
          id: 5,
          title: "Node.js Backend Development",
          description: "Build scalable backend services",
          createdAt: "2024-01-15",
          sections: [],
        },
      ] as ICourse[],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      enrolledAt: "2024-11-10",
      progress: 16.7, // 2 out of 12 courses
      coursesCompleted: 2,
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-700";
      case "INTERMEDIATE":
        return "bg-orange-100 text-orange-700";
      case "ADVANCED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleTakePlacementTest = () => {
    navigate("/student/placement-test");
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/student/courses/${courseId}/learn`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
        <p className="mt-1 text-gray-500">Take a placement test or view your enrolled learning paths</p>
      </div>

      {/* Placement Test Card */}
      <Card className="border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="rounded-xl bg-blue-500 p-4">
              <TrendingUp className="size-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Take a Placement Test</h3>
              <p className="mb-4 text-gray-600">
                Not sure about your current level? Take our placement test to assess your skills and get personalized
                learning path recommendations. The test includes multiple topics and difficulty levels to accurately
                determine your proficiency.
              </p>
              <Button onClick={handleTakePlacementTest} size="lg" className="gap-2">
                <TrendingUp className="size-5" />
                Start Placement Test
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Learning Paths */}
      {enrolledPaths.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Learning Paths</h2>
            <span className="text-sm text-gray-500">{enrolledPaths.length} path(s) enrolled</span>
          </div>

          {enrolledPaths.map((path) => (
            <Card key={path.id} className="overflow-hidden">
              <CardHeader className="border-b bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getLevelColor(path.level)}`}>
                        {path.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{path.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4" />
                    <span>
                      {path.coursesCompleted} / {path.totalCourses} courses
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{Math.round(path.progress)}% complete</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-blue-500 transition-all" style={{ width: `${path.progress}%` }} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="mb-4 font-semibold text-gray-900">Courses in this path:</h4>
                <div className="space-y-3">
                  {path.courses.map((course, index) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        {index < path.coursesCompleted ? (
                          <CheckCircle className="size-5 text-green-600" />
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{course.title}</h5>
                        <p className="text-sm text-gray-500">{course.description}</p>
                      </div>
                      <Button onClick={() => handleViewCourse(course.id)} variant="outline" size="sm" className="gap-2">
                        <Play className="size-4" />
                        {index < path.coursesCompleted ? "Review" : "Start"}
                      </Button>
                    </div>
                  ))}
                  {path.courses.length < path.totalCourses && (
                    <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                      +{path.totalCourses - path.courses.length} more courses in this path
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {enrolledPaths.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No Learning Paths Yet</h3>
            <p className="mb-4 text-gray-500">
              Take a placement test to get personalized learning path recommendations
            </p>
            <Button onClick={handleTakePlacementTest} className="gap-2">
              <TrendingUp className="size-4" />
              Take Placement Test
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningPaths;
