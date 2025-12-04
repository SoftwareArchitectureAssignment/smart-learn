"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Target,
  Eye,
  ChevronDown,
  ChevronUp,
  XCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Topic {
  id: string;
  name: string;
  description: string | null;
}

interface DetailedResult {
  questionId: string;
  questionText: string;
  userAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  status: string;
  isEnrolled: boolean;
  enrolledAt: string | null;
  createdAt: string;
  assessmentAttempt: {
    topicId: string;
    score: number;
    totalScore: number;
    totalQuestions: number;
    answers: any;
  };
  courses: {
    id: string;
    order: number;
    reason: string | null;
    isCompleted: boolean;
    course: {
      id: string;
      title: string;
      description: string | null;
      thumbnail: string | null;
    };
  }[];
}

interface LearningPathsClientProps {
  topics: Topic[];
  initialLearningPaths: LearningPath[];
  enrolledCourseIds: string[];
}

export function LearningPathsClient({ topics, initialLearningPaths, enrolledCourseIds }: LearningPathsClientProps) {
  const router = useRouter();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(initialLearningPaths);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set(enrolledCourseIds));
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const toggleExpanded = (pathId: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pathId)) {
        newSet.delete(pathId);
      } else {
        newSet.add(pathId);
      }
      return newSet;
    });
  };

  const handleEnrollCourse = async (pathId: string, courseId: string) => {
    try {
      const response = await fetch(`/api/learning-paths/${pathId}/courses/${courseId}/enroll`, {
        method: "POST",
      });

      if (response.ok) {
        setEnrolledCourses((prev) => new Set([...prev, courseId]));
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleEnrollAll = async (pathId: string, courseIds: string[]) => {
    try {
      const response = await fetch(`/api/learning-paths/${pathId}/enroll-all`, {
        method: "POST",
      });

      if (response.ok) {
        setEnrolledCourses((prev) => new Set([...prev, ...courseIds]));
      }
    } catch (error) {
      console.error("Error enrolling in all courses:", error);
    }
  };

  const getFeedback = (percentage: number) => {
    if (percentage >= 80) {
      return {
        title: "Excellent Performance! 🌟",
        message:
          "You've demonstrated advanced knowledge in this topic. You're ready for advanced courses and challenging content.",
        level: "Advanced",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    } else if (percentage >= 60) {
      return {
        title: "Good Foundation! 💪",
        message:
          "You have a solid understanding of the fundamentals. These intermediate courses will help you build on your existing knowledge.",
        level: "Intermediate",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    } else {
      return {
        title: "Great Start! 🚀",
        message:
          "You're beginning your journey in this topic. These beginner-friendly courses will help you build a strong foundation.",
        level: "Beginner",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
          <p className="mt-2 text-gray-600">Take an assessment to get personalized course recommendations</p>
        </div>
        <Button onClick={() => router.push("/student/learning-paths/assessment")} size="lg">
          <Brain className="mr-2 size-4" />
          Take Assessment
        </Button>
      </div>

      {/* Stats */}
      {learningPaths.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
              <Target className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningPaths.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recommended Courses</CardTitle>
              <BookOpen className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {learningPaths.reduce((sum, path) => sum + path.courses.length, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <CheckCircle2 className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.size}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Learning Paths List */}
      {learningPaths.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Brain className="mb-4 size-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Assessments Yet</h3>
            <p className="mb-6 text-center text-gray-600">
              Take an assessment test to get personalized course recommendations based on your skills and interests.
            </p>
            <Button onClick={() => router.push("/student/learning-paths/assessment")} size="lg">
              <Brain className="mr-2 size-4" />
              Take Your First Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {learningPaths.map((path) => {
            const percentage = Math.round((path.assessmentAttempt.score / path.assessmentAttempt.totalScore) * 100);
            const feedback = getFeedback(percentage);
            const isExpanded = expandedPaths.has(path.id);
            const unenrolledCourses = path.courses.filter((c) => !enrolledCourses.has(c.course.id));

            return (
              <Card key={path.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-2xl">{path.title}</CardTitle>
                        <Badge className={`${feedback.bgColor} ${feedback.color}`}>{feedback.level}</Badge>
                      </div>
                      <CardDescription className="mt-2">{path.description}</CardDescription>
                      <p className="mt-2 text-sm text-gray-500">
                        Assessment taken on {new Date(path.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Assessment Score & Feedback */}
                  <div className={`mt-4 rounded-lg border-2 p-4 ${feedback.borderColor} ${feedback.bgColor}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className={`font-semibold ${feedback.color}`}>{feedback.title}</h4>
                        <p className={`mt-2 text-sm ${feedback.color}`}>{feedback.message}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-4xl font-bold ${feedback.color}`}>{percentage}%</p>
                        <p className={`text-sm ${feedback.color}`}>
                          {path.assessmentAttempt.score} / {path.assessmentAttempt.totalScore} points
                        </p>
                        <p className={`mt-1 text-xs ${feedback.color}`}>
                          {path.assessmentAttempt.totalQuestions} questions
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    {unenrolledCourses.length > 0 && (
                      <Button
                        onClick={() =>
                          handleEnrollAll(
                            path.id,
                            unenrolledCourses.map((c) => c.course.id),
                          )
                        }
                        className="flex-1"
                      >
                        <GraduationCap className="mr-2 size-4" />
                        Enroll All Recommended Courses ({unenrolledCourses.length})
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/student/learning-paths/${path.id}/review`)}
                      className={unenrolledCourses.length > 0 ? "" : "flex-1"}
                    >
                      <Eye className="mr-2 size-4" />
                      Review Answers
                    </Button>
                  </div>
                </CardHeader>
                {/* Recommended Courses */}
                <CardContent>
                  <Collapsible open={isExpanded}>
                    <CollapsibleTrigger
                      onClick={() => toggleExpanded(path.id)}
                      className="flex w-full items-center justify-between"
                    >
                      <h4 className="font-semibold text-gray-900">
                        Recommended Learning Path ({path.courses.length} courses)
                      </h4>
                      {isExpanded ? (
                        <ChevronUp className="size-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="size-5 text-gray-400" />
                      )}
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-4 space-y-4">
                      {path.courses
                        .sort((a, b) => a.order - b.order)
                        .map((pathCourse) => {
                          const isEnrolled = enrolledCourses.has(pathCourse.course.id);

                          return (
                            <div key={pathCourse.id} className="flex items-start gap-4 rounded-lg border p-4">
                              {/* Course Image */}
                              <div className="shrink-0">
                                {pathCourse.course.thumbnail ? (
                                  <img
                                    src={pathCourse.course.thumbnail}
                                    alt={pathCourse.course.title}
                                    className="size-20 rounded object-cover"
                                  />
                                ) : (
                                  <div className="flex size-20 items-center justify-center rounded bg-gray-100">
                                    <BookOpen className="size-8 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Course Info */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">Step {pathCourse.order}</Badge>
                                      {isEnrolled && (
                                        <Badge className="bg-green-100 text-green-800">
                                          <CheckCircle2 className="mr-1 size-3" />
                                          Enrolled
                                        </Badge>
                                      )}
                                    </div>
                                    <h5 className="mt-2 font-semibold text-gray-900">{pathCourse.course.title}</h5>
                                    <p className="mt-1 text-sm text-gray-600">{pathCourse.course.description}</p>
                                    {pathCourse.reason && (
                                      <p className="mt-2 text-sm text-blue-600 italic">💡 {pathCourse.reason}</p>
                                    )}
                                  </div>
                                  <div className="flex shrink-0 gap-2">
                                    {!isEnrolled && (
                                      <Button
                                        onClick={() => handleEnrollCourse(path.id, pathCourse.course.id)}
                                        size="sm"
                                      >
                                        Enroll
                                      </Button>
                                    )}
                                    {isEnrolled && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/student/courses/${pathCourse.course.id}`)}
                                      >
                                        View Course
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
