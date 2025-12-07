import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Award, TrendingUp, Clock, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const { pathId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state as TestResultData;

  if (!result) {
    navigate(`/student/learning-paths/${pathId}/placement-test`);
    return null;
  }

  // Generate feedback based on score
  const getFeedback = (score: number) => {
    if (score >= 80) {
      return {
        title: "Excellent Performance!",
        message:
          "You have a strong understanding of this topic. We recommend starting with intermediate to advanced courses.",
        level: "ADVANCED",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    } else if (score >= 60) {
      return {
        title: "Good Job!",
        message:
          "You have a solid foundation. We recommend courses that will help you strengthen your knowledge and learn advanced concepts.",
        level: "INTERMEDIATE",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      };
    } else {
      return {
        title: "Keep Learning!",
        message:
          "You're just getting started. We recommend beginning with foundational courses to build a strong base.",
        level: "BEGINNER",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      };
    }
  };

  const feedback = getFeedback(result.score);

  // Mock recommended courses based on performance
  const recommendedCourses = [
    {
      id: "1",
      title: "React Fundamentals",
      description: "Master the basics of React and build your first components",
      duration: "8 hours",
      level: feedback.level,
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      description: "Learn advanced patterns and best practices for React development",
      duration: "12 hours",
      level: feedback.level,
    },
    {
      id: "3",
      title: "State Management with Redux",
      description: "Deep dive into state management using Redux and Redux Toolkit",
      duration: "10 hours",
      level: feedback.level,
    },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleStartLearningPath = () => {
    navigate("/student/courses");
  };

  const handleRetakeTest = () => {
    navigate(`/student/learning-paths/${pathId}/placement-test`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
        <p className="mt-1 text-gray-500">
          {result.config.topic} - {result.config.difficulty}
        </p>
      </div>

      {/* Score Card */}
      <Card className={feedback.bgColor}>
        <CardContent className="p-8 text-center">
          <div className="mb-4 inline-flex size-24 items-center justify-center rounded-full bg-white shadow-lg">
            <Award className={`size-12 ${feedback.color}`} />
          </div>
          <h2 className={`mb-2 text-4xl font-bold ${feedback.color}`}>{result.score}%</h2>
          <p className="mb-2 text-xl font-semibold text-gray-900">{feedback.title}</p>
          <p className="mx-auto max-w-2xl text-gray-600">{feedback.message}</p>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Correct Answers</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {result.correctAnswers} / {result.totalQuestions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Time Spent</CardTitle>
            <Clock className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(result.timeSpent)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recommended Level</CardTitle>
            <TrendingUp className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedback.level}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Courses for You</CardTitle>
          <p className="text-sm text-gray-500">Based on your test results, we recommend starting with these courses</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <div className="rounded-lg bg-blue-50 p-3">
                <BookOpen className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{course.description}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {course.duration}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium">{course.level}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={handleRetakeTest}>
          Retake Test
        </Button>
        <Button onClick={handleStartLearningPath}>
          Start Learning Path
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestResult;
