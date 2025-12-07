"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizAttemptClientProps {
  quiz: any;
}

export function QuizAttemptClient({ quiz }: QuizAttemptClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnsweredCurrent = !!answers[currentQuestion?.id];

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quiz-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const courseId = quiz.content.section.course.id;

  // Show result screen
  if (result) {
    const passed = result.percentage >= (quiz.passingScore || 0);

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl">
          <Link href={`/student/courses/${courseId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="mr-1 size-4" />
              Back to Course
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Result</CardTitle>
              <CardDescription>{quiz.content.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                {passed ? (
                  <div className="rounded-full bg-green-100 p-6">
                    <Trophy className="size-20 text-green-600" />
                  </div>
                ) : (
                  <div className="rounded-full bg-red-100 p-6">
                    <XCircle className="size-20 text-red-600" />
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-3xl font-bold">{passed ? "Congratulations!" : "Keep Trying!"}</h3>
                  <p className="mt-2 text-gray-600">
                    {passed ? "You passed the quiz!" : "You didn't pass this time, but don't give up!"}
                  </p>
                </div>

                <div className="flex items-center gap-12 text-center">
                  <div>
                    <p className="text-4xl font-bold">{result.percentage}%</p>
                    <p className="text-sm text-gray-600">Your Score</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">
                      {result.score}/{result.totalScore}
                    </p>
                    <p className="text-sm text-gray-600">Points</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">{quiz.passingScore}%</p>
                    <p className="text-sm text-gray-600">Passing Score</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={`/student/courses/${courseId}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Back to Course
                  </Button>
                </Link>
                <Link href={`/student/quiz/${quiz.id}/attempts`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View All Attempts
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                    setCurrentQuestionIndex(0);
                  }}
                  className="flex-1"
                >
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show quiz questions
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link href={`/student/courses/${courseId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="mr-1 size-4" />
            Back to Course
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{quiz.content.title}</CardTitle>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{currentQuestion?.text}</h3>

              <div className="space-y-3">
                {currentQuestion?.options.map((option: any) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      answers[currentQuestion.id] === option.id ? "border-blue-600 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={answers[currentQuestion.id] === option.id}
                      onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                      className="mt-1"
                    />
                    <span className="flex-1">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                Previous
              </Button>

              <div className="text-sm text-gray-600">
                {Object.keys(answers).length} of {quiz.questions.length} answered
              </div>

              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== quiz.questions.length || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={!hasAnsweredCurrent}>
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
