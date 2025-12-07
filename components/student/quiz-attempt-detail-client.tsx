"use client";

import Link from "next/link";
import { ChevronLeft, CheckCircle, XCircle, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface QuizAttemptDetailClientProps {
  attempt: any;
}

export function QuizAttemptDetailClient({ attempt }: QuizAttemptDetailClientProps) {
  const { quiz } = attempt;
  const courseId = quiz.content.section.course.id;
  const percentage = Math.round((attempt.score / attempt.totalScore) * 100);
  const passed = percentage >= (quiz.passingScore || 0);
  const answers = attempt.answers as Record<string, string>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link href={`/student/quiz/${quiz.id}/attempts`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="mr-1 size-4" />
            Back to Attempts
          </Button>
        </Link>

        {/* Result Summary */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attempt Details</CardTitle>
                <CardDescription>{quiz.content.title}</CardDescription>
              </div>
              <Badge
                className={
                  passed ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"
                }
              >
                {passed ? "Passed" : "Failed"}
              </Badge>
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
                    {attempt.score}/{attempt.totalScore}
                  </p>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{quiz.passingScore}%</p>
                  <p className="text-sm text-gray-600">Passing Score</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="size-4" />
                <span>{format(new Date(attempt.attemptedAt), "MMM dd, yyyy 'at' HH:mm")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Feedback */}
        {attempt.feedback && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Teacher Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none rounded-lg bg-blue-50 p-4 text-sm whitespace-pre-wrap">
                {attempt.feedback}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Question Review</h2>
          {quiz.questions.map((question: any, index: number) => {
            const selectedOptionId = answers[question.id];
            const correctOption = question.options.find((opt: any) => opt.isCorrect);
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
                  {question.options.map((option: any) => {
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
                              : "bg-gray-50"
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
          <Link href={`/student/courses/${courseId}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Course
            </Button>
          </Link>
          <Link href={`/student/quiz/${quiz.id}/attempt`} className="flex-1">
            <Button className="w-full">Retake Quiz</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
