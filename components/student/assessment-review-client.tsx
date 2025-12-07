"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle, XCircle, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createLearningPathApi } from "@/apis/ai/create-learining-path.api";

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface DetailedResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
}

interface AssessmentReviewClientProps {
  learningPath: {
    id: string;
    title: string;
    assessmentAttempt: {
      id: string;
      score: number;
      totalScore: number;
      totalQuestions: number;
      answers: Record<string, string>;
      topicId: string;
      topicName: string;
    };
  };
  questions: Question[];
  allCourses: Course[];
  hasLearningPath: boolean;
}

export function AssessmentReviewClient({
  learningPath,
  questions,
  allCourses,
  hasLearningPath,
}: AssessmentReviewClientProps) {
  const router = useRouter();
  const [isCreatingLearningPath, setIsCreatingLearningPath] = useState(false);
  const { assessmentAttempt } = learningPath;
  const percentage = Math.round((assessmentAttempt.score / assessmentAttempt.totalScore) * 100);
  const answers = assessmentAttempt.answers;

  const correctCount = questions.filter((question) => {
    const selectedOptionId = answers[question.id];
    const correctOption = question.options.find((opt) => opt.isCorrect);
    return selectedOptionId === correctOption?.id;
  }).length;

  const handleCreateLearningPath = async () => {
    setIsCreatingLearningPath(true);
    try {
      // Determine level based on percentage
      let level = "beginner";
      if (percentage >= 80) {
        level = "advanced";
      } else if (percentage >= 60) {
        level = "intermediate";
      }

      // Format questions with answers for AI
      const questionsData: DetailedResult[] = questions.map((question) => {
        const selectedOptionId = answers[question.id];
        const selectedOption = question.options.find((o) => o.id === selectedOptionId);
        const correctOption = question.options.find((o) => o.isCorrect);
        const isCorrect = selectedOptionId === correctOption?.id;

        return {
          question: question.text,
          userAnswer: selectedOption?.text || "No answer",
          correctAnswer: correctOption?.text || "Unknown",
          isCorrect,
        };
      });

      // Format courses for AI
      const coursesInfo = allCourses.map((course) => ({
        course_uid: course.id,
        course_name: course.title,
        description: course.description || "",
      }));

      // Create prompt for AI
      const prompt = `Based on the student's assessment results in ${assessmentAttempt.topicName}, recommend appropriate courses. The student scored ${percentage}% (${assessmentAttempt.score}/${assessmentAttempt.totalScore}) which indicates a ${level} level.`;

      // Prepare messages field with prompt, courses, and questions
      const messages = JSON.stringify({
        prompt,
        courses: coursesInfo,
        questions: questionsData,
      });

      // Call AI API using the API function
      const aiData = await createLearningPathApi({
        topics: assessmentAttempt.topicName,
        level: level,
        questions: messages,
      });

      // Create learning path in database with AI recommendations
      const createResponse = await fetch("/api/learning-paths", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessmentAttemptId: assessmentAttempt.id,
          recommendations: aiData.recommendedLearningPaths || [],
          advice: aiData.advice || "",
          explanation: aiData.explanation || "",
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create learning path");
      }

      // Refresh page to show new learning path
      router.refresh();
    } catch (error) {
      console.error("Error creating learning path:", error);
      alert("Failed to create learning path. Please try again.");
    } finally {
      setIsCreatingLearningPath(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/student/learning-paths">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="mr-1 size-4" />
            Back to Learning Paths
          </Button>
        </Link>

        {/* Result Summary */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assessment Review</CardTitle>
                <CardDescription>{assessmentAttempt.topicName} Assessment</CardDescription>
              </div>
              {!hasLearningPath && (
                <Button onClick={handleCreateLearningPath} disabled={isCreatingLearningPath}>
                  {isCreatingLearningPath ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 size-4" />
                      Create Learning Path
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold">{percentage}%</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {correctCount}/{assessmentAttempt.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {assessmentAttempt.score}/{assessmentAttempt.totalScore}
                  </p>
                  <p className="text-sm text-gray-600">Points</p>
                </div>
              </div>
            </div>
            {!hasLearningPath && (
              <div className="mt-4 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  💡 Click "Create Learning Path" to get AI-powered course recommendations based on your assessment
                  results.
                </p>
              </div>
            )}
            {hasLearningPath && (
              <div className="mt-4 rounded-lg bg-green-50 p-4">
                <p className="text-sm text-green-800">
                  ✅ Learning path has been created! View your personalized course recommendations on the Learning Paths
                  page.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Question Review</h2>
          {questions.map((question, index) => {
            const selectedOptionId = answers[question.id];
            const correctOption = question.options.find((opt) => opt.isCorrect);
            const isCorrect = selectedOptionId === correctOption?.id;

            return (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">
                      Question {index + 1}: {question.text}
                    </CardTitle>
                    {isCorrect ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="mr-1 size-3" />
                        Correct
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        <XCircle className="mr-1 size-3" />
                        Incorrect
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrectAnswer = option.isCorrect;

                    return (
                      <div
                        key={option.id}
                        className={`flex items-start gap-3 rounded-lg border p-4 ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-50"
                            : isSelected
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex size-6 items-center justify-center">
                          {isCorrectAnswer ? (
                            <CheckCircle className="size-5 text-green-600" />
                          ) : isSelected ? (
                            <XCircle className="size-5 text-red-600" />
                          ) : (
                            <div className="size-4 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{option.text}</p>
                          {isCorrectAnswer && <p className="mt-1 text-sm text-green-700">✓ Correct Answer</p>}
                          {isSelected && !isCorrectAnswer && <p className="mt-1 text-sm text-red-700">✗ Your Answer</p>}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Link href="/student/learning-paths" className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Learning Paths
            </Button>
          </Link>
          <Link href="/student/learning-paths/assessment" className="flex-1">
            <Button className="w-full">Take Another Assessment</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
