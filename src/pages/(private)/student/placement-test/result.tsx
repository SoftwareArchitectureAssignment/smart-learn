import { useNavigate, useLocation } from "react-router-dom";
import { Award, TrendingUp, Clock, BookOpen, CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LearningPath } from "@/types/learning-path.type";
import type { ICourse } from "@/types/course.type";

interface TestResultData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  config: {
    topic: string;
    difficulty: string;
  };
}

const TestResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state as TestResultData;

  if (!result) {
    navigate("/student/placement-test");
    return null;
  }

  // Generate feedback based on score
  const getFeedback = (score: number) => {
    if (score >= 80) {
      return {
        title: "Excellent Performance!",
        message:
          "You have demonstrated strong proficiency in this topic. We recommend advanced-level courses to further enhance your expertise and tackle complex challenges.",
        level: "ADVANCED",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    } else if (score >= 60) {
      return {
        title: "Good Job!",
        message:
          "You have a solid foundation in this area. We recommend intermediate courses to strengthen your knowledge and learn advanced concepts systematically.",
        level: "INTERMEDIATE",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    } else {
      return {
        title: "Keep Learning!",
        message:
          "You're at the beginning of your learning journey. We recommend starting with foundational courses to build a strong base before moving to more advanced topics.",
        level: "BEGINNER",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    }
  };

  const feedback = getFeedback(result.score);

  // Mock recommended learning paths based on score and topic
  const recommendedPaths: LearningPath[] = [
    {
      id: "1",
      title: `${result.config.topic} - ${feedback.level} Path`,
      description: `Comprehensive learning path for ${feedback.level.toLowerCase()} level focusing on ${result.config.topic}`,
      level: feedback.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
      duration:
        feedback.level === "BEGINNER" ? "3 months" : feedback.level === "INTERMEDIATE" ? "4 months" : "3 months",
      totalCourses: feedback.level === "BEGINNER" ? 6 : feedback.level === "INTERMEDIATE" ? 8 : 5,
      courses: [
        {
          id: 1,
          title: `${result.config.topic} Fundamentals`,
          description: "Master the core concepts and foundations",
          createdAt: "2024-01-15",
          sections: [],
        },
        {
          id: 2,
          title: `Advanced ${result.config.topic}`,
          description: "Deep dive into advanced topics and patterns",
          createdAt: "2024-01-15",
          sections: [],
        },
        {
          id: 3,
          title: `${result.config.topic} Best Practices`,
          description: "Learn industry standards and best practices",
          createdAt: "2024-01-15",
          sections: [],
        },
      ] as ICourse[],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleEnrollPath = (pathId: string) => {
    // In real app, this would call an API to enroll the user
    navigate("/student/learning-paths");
  };

  const handleRetakeTest = () => {
    navigate("/student/placement-test");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <Award className="mx-auto mb-4 size-16 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-900">Test Complete!</h1>
        <p className="mt-2 text-gray-600">Here are your results and personalized recommendations</p>
      </div>

      {/* Score Card */}
      <Card className={`${feedback.borderColor} border-2 ${feedback.bgColor}`}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto mb-2 flex size-32 items-center justify-center rounded-full bg-white shadow-lg">
                <span className={`text-5xl font-bold ${feedback.color}`}>{result.score}%</span>
              </div>
              <h2 className={`text-2xl font-bold ${feedback.color}`}>{feedback.title}</h2>
            </div>
            <p className="mx-auto max-w-2xl text-gray-700">{feedback.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <CheckCircle className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Correct Answers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.correctAnswers} / {result.totalQuestions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3">
                <TrendingUp className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recommended Level</p>
                <p className="text-2xl font-bold text-gray-900">{feedback.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3">
                <Clock className="size-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(result.timeSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Learning Paths */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recommended Learning Paths</h2>
        </div>

        {recommendedPaths.map((path) => (
          <Card key={path.id} className="overflow-hidden">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <CardTitle className="text-xl">{path.title}</CardTitle>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        path.level === "BEGINNER"
                          ? "bg-green-100 text-green-700"
                          : path.level === "INTERMEDIATE"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {path.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{path.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4" />
                  <span>{path.totalCourses} courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{path.duration}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h4 className="mb-4 font-semibold text-gray-900">Courses included:</h4>
              <div className="space-y-3">
                {path.courses.map((course, index) => (
                  <div key={course.id} className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                      <span className="font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{course.title}</h5>
                      <p className="text-sm text-gray-500">{course.description}</p>
                    </div>
                  </div>
                ))}
                {path.courses.length < path.totalCourses && (
                  <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                    +{path.totalCourses - path.courses.length} more courses in this path
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button onClick={() => handleEnrollPath(path.id)} className="w-full gap-2" size="lg">
                  Enroll in this Learning Path
                  <ArrowRight className="size-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={handleRetakeTest} className="gap-2">
          <RotateCcw className="size-4" />
          Retake Test
        </Button>
        <Button onClick={() => navigate("/student/learning-paths")} className="gap-2">
          <BookOpen className="size-4" />
          View My Learning Paths
        </Button>
      </div>
    </div>
  );
};

export default TestResult;
